const Restaurant = require('../models/Restaurant');
const mongoose = require("mongoose");

class RestaurantRepository { 
  async getById(restaurantId) {
    return await Restaurant.findById(restaurantId);
  }

  async create(data) {
    return await Restaurant.create(data);
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
                      { $pow: [{ $subtract: ["$address.geo.coordinates.1", lat] }, 2] },
                      { $pow: [{ $subtract: ["$address.geo.coordinates.0", lng] }, 2] }
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
          distance: lat && lng ? 1 : 0
        }
      }
    ]);
  }
}
module.exports = new RestaurantRepository();