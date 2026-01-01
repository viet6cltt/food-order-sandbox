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

  async getAll({ limit = 16, skip = 0 }) {
    const [items, total] = await Promise.all([
      Restaurant.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Restaurant.countDocuments()
    ]);
    return { items, total };
  }

  async getRecommend({ limit = 5 } = {}) {
    const l = Math.max(1, Math.min(50, parseInt(limit, 10) || 5));
    return await Restaurant.find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
      .limit(l)
      .select('name address rating description bannerUrl reviewCount _id');
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


  async findByOwnerId(ownerId) {
    return await Restaurant.findOne({ ownerId: ownerId });
  }

  async updateById(restaurantId, update) {
    return await Restaurant.findByIdAndUpdate(restaurantId, update, { new: true, runValidators: true });
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
}
module.exports = new RestaurantRepository();