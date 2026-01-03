const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

class RestaurantRepository { 
  async getById(restaurantId) {
    if (!mongoose.Types.ObjectId.isValid(String(restaurantId))) {
      return null;
    }
    return await Restaurant.findById(restaurantId);
  }

  async findByOwnerId(ownerId) {
    return await Restaurant.findOne({ ownerId: ownerId });
  }

  async create(data) {
    return await Restaurant.create(data);
  }

  async updateBannerUrl(id, url) {
    return await Restaurant.findByIdAndUpdate(
      id,
      { bannerUrl: url },
      { new: true }
    );
  }

  async updateRatingAndCount(id, { newRating, newCount }) {
    return await Restaurant.findByIdAndUpdate(
      id,
      {
        $set: {
          rating: newRating,
          reviewCount: newCount
        }
      },
      { new: true }
    );
  }

  async updateStatus(restaurantId, status) {
    return await Restaurant.findByIdAndUpdate(
      restaurantId,
      { 
        $set: {
          status
        },
      },
      { new: true }
    )
  }

  async search({ keyword, lat, lng, limit = 10, skip = 20 }) {
    const safeKeyword = typeof keyword === 'string' ? keyword.trim() : '';
    if (!safeKeyword) return [];

    const hasLocation =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng);

    const safeLimit = typeof limit === 'number' && Number.isFinite(limit) && limit > 0 ? limit : 20;
    const safeSkip = typeof skip === 'number' && Number.isFinite(skip) && skip > 0 ? skip : 0;

    // Accept boolean-ish numeric values from legacy data.
    const activeMatch = {
      status: 'ACTIVE',
      isActive: { $in: [true, 1] },
    };

    const geoStages = hasLocation
      ? [
          {
            $addFields: {
              distance: {
                $sqrt: {
                  $add: [
                    {
                      $pow: [
                        { $subtract: [{ $arrayElemAt: ['$address.geo.coordinates', 1] }, lat] },
                        2,
                      ],
                    },
                    {
                      $pow: [
                        { $subtract: [{ $arrayElemAt: ['$address.geo.coordinates', 0] }, lng] },
                        2,
                      ],
                    },
                  ],
                },
              },
            },
          },
          { $sort: { distance: 1 } },
        ]
      : [];

    const outputProject = {
      $project: {
        name: 1,
        address: 1,
        rating: 1,
        description: 1,
        bannerUrl: 1,
        _id: 1,
        ...(hasLocation ? { distance: 1 } : {}),
      },
    };

    const runPipeline = (pipeline) => Restaurant.aggregate(pipeline);

    // Primary: Atlas Search ($search). If not supported (local Mongo), fall back to regex matching.
    try {
      const searchResults = await runPipeline([
        {
          $search: {
            index: 'restaurant_search',
            compound: {
              should: [
                {
                  autocomplete: {
                    path: 'name',
                    query: safeKeyword,
                  },
                },
                {
                  text: {
                    path: 'description',
                    query: safeKeyword,
                  },
                },
              ],
            },
          },
        },
        { $match: activeMatch },
        ...geoStages,
        ...(safeSkip ? [{ $skip: safeSkip }] : []),
        { $limit: safeLimit },
        outputProject,
      ]);

      if (Array.isArray(searchResults) && searchResults.length > 0) {
        return searchResults;
      }
      // fall through to regex fallback when the $search index exists but yields no results
      // (common in local/dev envs without a properly configured Atlas Search index)
    } catch (err) {
      // fall through to regex fallback
    }

    const escaped = safeKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(escaped, 'i');

    return await runPipeline([
      {
        $match: {
          ...activeMatch,
          $or: [{ name: rx }, { description: rx }],
        },
      },
      ...geoStages,
      ...(safeSkip ? [{ $skip: safeSkip }] : []),
      { $limit: safeLimit },
      outputProject,
    ]);
  }

  async getRecommend() {
    return await Restaurant.find()
      .sort({ rating: -1 }) // giảm dần theo rating
      .limit(5);
  }

  async findAll({ filter, sort, skip, limit }) {
    const [items, total] = await Promise.all([
      Restaurant.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Restaurant.countDocuments(filter)
    ]);

    return { items, total };
  }

  async findAllWithScore({ filter, sort, skip, limit, lat, lng }) {
    const pipeline = [];

    const hasLocation =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng);

    // When using $geoNear, documents missing/invalid coordinates can cause errors.
    // Pre-filter to only restaurants with a valid Point + numeric coordinates.
    const geoQuery = {
      ...filter,
      'address.geo.type': 'Point',
      'address.geo.coordinates.0': { $type: 'number' },
      'address.geo.coordinates.1': { $type: 'number' },
    };

    // 1. Nếu có tọa độ, ưu tính tính khoảng cách bằng $geoNear
    if (hasLocation) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance", 
          query: geoQuery,
          spherical: true,
          //maxDistance: 15000, // giả định r tối đa 15km để tính điểm
          key: "address.geo" // Specify which geospatial index to use
        }
      });

      // 2. tính điểm
      pipeline.push({
        $addFields: {
          distanceScore: {
            $multiply: [
              { $subtract: [1, { $min: [{ $divide: ["$distance", 15000] }, 1] }] },
              10
            ]
          },
          // Rating hiện tại thang 5 -> nhân 2
          ratingScore: { $multiply: ["$rating", 2] }
        }
      });

      pipeline.push({
        $addFields: {
          finalScore: {
            $add: [
              { $multiply: ["$ratingScore", 0.7] },
              { $multiply: ["$distanceScore", 0.3] }
            ]
          }
        }
      });

      // 3. Sắp xếp: isActive -> finalScore
      pipeline.push({ $sort: { isActive: -1, finalScore: -1 } });
    } else {
      // Nếu k tọa độ, dùng filter và sort truyền thống
      pipeline.push({ $match: filter });
      pipeline.push({ $sort: { isActive: -1, ...sort }});
    }

    // 4. Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Truy vấn
    const [items, total] = await Promise.all([
      Restaurant.aggregate(pipeline),
      Restaurant.countDocuments(hasLocation ? geoQuery : filter)
    ]);

    return { items, total };
  }

  async findAllByOwnerId(ownerId) {
    return await Restaurant.find({ ownerId }).sort({ createdAt: -1 });
  }

  async update(restaurantId, updateData) {
    // Protect 2dsphere index updates: MongoDB requires GeoJSON Point to include coordinates.
    // If an invalid geo gets stored (e.g. { type: 'Point' } without coordinates), any update may crash with:
    // "Can't extract geo keys... Point must be an array or object".
    const updateOps = { $set: { ...updateData } };
    const unsetOps = {};

    const incomingGeo = updateData?.address?.geo;
    if (incomingGeo && typeof incomingGeo === 'object') {
      const coords = incomingGeo.coordinates;
      const hasValidCoords =
        Array.isArray(coords) &&
        coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number' &&
        Number.isFinite(coords[0]) &&
        Number.isFinite(coords[1]);

      if (!hasValidCoords) {
        // Do not persist an invalid geo object.
        unsetOps['address.geo'] = 1;
        // Remove geo from $set (keep other address fields).
        if (updateOps.$set.address && typeof updateOps.$set.address === 'object') {
          const nextAddress = { ...updateOps.$set.address };
          delete nextAddress.geo;
          updateOps.$set.address = nextAddress;
        }
      }
    }

    // Auto-heal existing invalid geo if present and caller didn't supply valid coordinates.
    if (!incomingGeo || (incomingGeo && typeof incomingGeo === 'object' && !Array.isArray(incomingGeo.coordinates))) {
      const existing = await Restaurant.findById(restaurantId).select('address.geo').lean();
      const existingCoords = existing?.address?.geo?.coordinates;
      const existingHasValidCoords =
        Array.isArray(existingCoords) &&
        existingCoords.length === 2 &&
        typeof existingCoords[0] === 'number' &&
        typeof existingCoords[1] === 'number' &&
        Number.isFinite(existingCoords[0]) &&
        Number.isFinite(existingCoords[1]);

      const existingHasTypeOnly = existing?.address?.geo?.type === 'Point' && !existingHasValidCoords;
      if (existingHasTypeOnly) {
        unsetOps['address.geo'] = 1;
      }
    }

    if (Object.keys(unsetOps).length > 0) {
      updateOps.$unset = unsetOps;
    }

    return await Restaurant.findByIdAndUpdate(restaurantId, updateOps, {
      new: true,
      runValidators: true,
    });
  }
}
module.exports = new RestaurantRepository();