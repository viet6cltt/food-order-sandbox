const reviewRepo = require("@/repositories/review.repository");
const orderRepo = require("@/repositories/order.repository");
const restaurantService = require('@/services/app/restaurant.service');

const ERR = require("@/utils/httpErrors");
const cloudinary = require('@/config/cloudinary.config');
const fs = require('fs');

class ReviewService {

  async updateRestaurantRating(restaurantId, reviewRating) {
    //1 . Get data
    const restaurant = restaurantService.getRestaurantInfo(restaurantId);
    if (!restaurant) return;

    // 2. Get current values
    const oldCount = restaurant.reviewCount || 0;
    const oldRating = restaurant.rating || 0;

    // 3. Cal new values
    const newCount = oldCount + 1;

    const calculatedRating = ((oldRating * oldCount) + reviewRating) / newCount;

    const newRating = Math.round(calculatedRating * 10) / 10;

    // 4. save
    return await restaurantService.updateRatingAndCount(restaurantId, { newRating, newCount })
  }

  async getDetail(id) {
    return await reviewRepo.findById(id);
  }

  async create(data) {
    const { userId, orderId, restaurantId, rating, comment, files } = data;

    try {
      // 1. check order belongs to user + completed 
      const existingReview = await reviewRepo.findByUserIdOrOrderId({ userId, orderId });
      if (existingReview) {
        throw new ERR.ConflictError('You have already reviewed this order');
      }
      const order = await orderRepo.findById(orderId);
      if (!order) {
        throw new ERR.NotFoundError("Order not found");
      }

      if (String(order.userId) !== String(userId)) {
        throw new ERR.ForbiddenError("You have no permission to create review");
      }

      if (order.status !== "completed") {
        throw new ERR.BadRequestError("Order not completed, cannot review");
      }

      let imageUrls = [];

      // 2. Upload files to Cloudinary
      if (files && files.length > 0) {
        const uploadPromises = files.map(file => 
          cloudinary.uploader.upload(file.path, {
            folder: `food-order/reviews/${restaurantId}`,
            public_id: `review-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
          })
        );

        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => result.secure_url);

        // delete temp files
        files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }

      // 3. data to save in DB
      const reviewData = {
        userId, 
        orderId,
        restaurantId,
        rating,
        comment,
        images: imageUrls,
        items: order.items.map(item => item.menuItemId)
      };

      await orderRepo.update(order._id, { isReviewed: true });

      const newReview = await reviewRepo.create(reviewData);

      // 4. update Rating for restaurant
      await this.updateRestaurantRating(restaurantId, rating);

      return newReview;
    } catch (err) {
      // if error occurs, delete temp files
      if (files) files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      })

      throw err;
    }
    
  }

  async listByRestaurant(restaurantId, pagination) {
    const { items, total } = await reviewRepo.findPublishedByRestaurant(restaurantId, pagination);

    return {
      items,
      meta: {
        total, page: pagination.page, limit: pagination.limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async findByMenuItem(menuItemId, pagination) {

    const { items, total } =  await reviewRepo.findPublishedByMenuItem(menuItemId, pagination);

    return {
      items,
      meta: {
        total, page: pagination.page, limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit)
      }
    }
  }
}

module.exports = new ReviewService();