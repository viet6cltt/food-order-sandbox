const Restaurant = require('../models/Restaurant');

class RestaurantRepository { 
  async getById(restaurantId) {
    return await Restaurant.findById(restaurantId);
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

  async search({ keyword, lat, lng, limit = 0, skip = 20 }) {
    return Restaurant.aggregate([
      {
        $search: {
          index: "restaurant_search",
          compound: {
            should: [
              {
                autocomplete: {
                  path: "name",
                  query: keyword
                }
              },
              {
                text: {
                  path: "description",
                  query: keyword
                }
              }
            ]
          }
        }
      },

      // GEO DISTANCE SORTING
      ...(lat && lng
        ? [
            {
              $addFields: {
                distance: {
                  $sqrt: {
                    $add: [
                      { 
                        $pow: [
                          { $subtract: [{ $arrayElemAt: ["$address.geo.coordinates", 1] }, lat] }, 
                          2
                        ] 
                      },
                      { 
                        $pow: [
                          { $subtract: [{ $arrayElemAt: ["$address.geo.coordinates", 0] }, lng] }, 
                          2
                        ] 
                      }
                    ]
                  }
                }
              }
            },
            { $sort: { distance: 1 } }
          ]
        : []
      ),

      // Filter active restaurant *after* search scoring
      { $match: { isActive: true } },

      // PAGINATION
      ...(skip ? [{ $skip: skip }] : []),
      { $limit: limit },

      // OUTPUT FIELDS
      {
        $project: {
          name: 1,
          address: 1,
          rating: 1,
          description: 1,
          bannerUrl: 1,
          _id: 1,
          ...(lat && lng ? { distance: 1 } : {})
        }
      }
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

    // 1. Nếu có tọa độ, ưu tính tính khoảng cách bằng $geoNear
    if (lat && lng) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance", 
          query: filter,
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
      Restaurant.countDocuments(filter)
    ]);

    return { items, total };
  }

  async findByOwnerId(ownerId) {
    return await Restaurant.find({ ownerId }).sort({ createdAt: -1 });
  }

  async update(restaurantId, updateData) {
    return await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
}
module.exports = new RestaurantRepository();