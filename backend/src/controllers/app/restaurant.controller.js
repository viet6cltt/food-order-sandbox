const RestaurantService = require('@/services/app/restaurant.service');
const ERR = require('@/constants/errorCodes');
const ERR_RESPONSE = require('@/utils/httpErrors');
const SUCCESS_RESPONSE = require('@/utils/successResponse');
const mongoose = require('mongoose');

class RestaurantController {
  /**
   * @swagger
   * /restaurants/{restaurantId}:
   *   get:
   *     summary: Get restaurant info by ID
   *     description: Retrieve detailed information about a specific restaurant
   *     tags:
   *       - Restaurants
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Restaurant ID
   *         example: "695766bc800adc19a9b60145"
   *     responses:
   *       200:
   *         description: Restaurant information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *       400:
   *         description: Missing restaurant ID
   *       404:
   *         description: Restaurant not found
   */
  async getInfo(req, res, next) {
    try {
      const { restaurantId } = req.params;
      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing restaurant ID", ERR.INVALID_INPUT);
      }

      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        throw new ERR_RESPONSE.BadRequestError("Invalid restaurant ID", ERR.INVALID_INPUT);
      }

      const restaurantInfo = await RestaurantService.getRestaurantInfo(restaurantId);

      return res.json(restaurantInfo);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants:
   *   get:
   *     summary: Get all restaurants with filtering and sorting
   *     description: Retrieve restaurants with optional filtering by category, sorting, and geolocation
   *     tags:
   *       - Restaurants
   *     parameters:
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: string
   *         description: Filter by category ID (optional)
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [rating, newest]
   *           default: rating
   *         description: Sort restaurants by rating or newest
   *       - in: query
   *         name: lat
   *         schema:
   *           type: number
   *         description: User latitude for distance calculation (optional)
   *       - in: query
   *         name: lng
   *         schema:
   *           type: number
   *         description: User longitude for distance calculation (optional)
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Restaurants retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     items:
   *                       type: array
   *                       items:
   *                         type: object
   *                     meta:
   *                       type: object
   */
  async getAll(req, res, next) {
    try {
      // 1. lat, lng from query string
      const { categoryId, sortBy, lat, lng } = req.query;

      
      const pagination = req.pagination;

      // 2. data to service
      const options = {
        categoryId: categoryId || null,
        pagination,
        sortBy: sortBy || 'rating',
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      };

      // 3. handle
      const result = await RestaurantService.getRestaurants(options);

      // 4. return
      return SUCCESS_RESPONSE.success(res, 'Get restaurants successfully', result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/search:
   *   get:
   *     summary: Search restaurants by keyword
   *     description: Search for restaurants by name or description
   *     tags:
   *       - Restaurants
   *     parameters:
   *       - in: query
   *         name: keyword
   *         required: true
   *         schema:
   *           type: string
   *         description: Search keyword
   *         example: "Phở"
   *       - in: query
   *         name: lat
   *         schema:
   *           type: number
   *         description: User latitude for distance sorting (optional)
   *       - in: query
   *         name: lng
   *         schema:
   *           type: number
   *         description: User longitude for distance sorting (optional)
   *       - in: query
   *         name: skip
   *         schema:
   *           type: integer
   *           default: 0
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *       400:
   *         description: Missing search keyword
   */
  async search(req, res, next) {
    try {
      const { keyword, lat, lng } = req.query;
      const { skip, limit } = req.pagination;

      console.log(keyword, lat, lng);

      const data = await RestaurantService.searchRestaurants({ keyword, lat, lng, skip, limit });

      return SUCCESS_RESPONSE.success(res, `search restaurants by keyword ${keyword}`, data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/{restaurantId}/banner:
   *   patch:
   *     summary: Upload restaurant banner
   *     description: Upload or update restaurant banner image
   *     tags:
   *       - Restaurants
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: Restaurant ID
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Banner uploaded successfully
   *       400:
   *         description: Missing restaurant ID or file
   *       401:
   *         description: Unauthorized
   */
  async uploadBanner(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const file = req.file;

      if (!restaurantId) {
        throw new ERR_RESPONSE.BadRequestError("Missing id if Restaurant", ERR.INVALID_INPUT);
      }

      if (!file) {
        throw new ERR_RESPONSE.BadRequestError("File is required");
      }

      const updated = await RestaurantService.uploadBanner(restaurantId, file);

      return SUCCESS_RESPONSE.success(res, `Banner updated successfully`, updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
    * /users/owner/restaurant:
    *   get:
    *     summary: Get my restaurant (owner)
    *     description: Retrieve the restaurant associated with the authenticated owner
    *     tags:
    *       - Restaurants
    *     security:
    *       - bearerAuth: []
    *     responses:
    *       200:
    *         description: Restaurant retrieved successfully
    *       401:
    *         description: Unauthorized
    *       403:
    *         description: Not restaurant owner
   */
  async getMyRestaurant(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError("User not authenticated", ERR.UNAUTHORIZED);
      }

      const restaurant = await RestaurantService.getRestaurantByOwnerId(userId);
      
      if (!restaurant) {
        throw new ERR_RESPONSE.NotFoundError("Restaurant not found for this owner", ERR.RESTAURANT_NOT_FOUND);
      }

      return SUCCESS_RESPONSE.success(res, "Get restaurant successfully", restaurant);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /users/owner/restaurant:
   *   patch:
   *     summary: Update my restaurant (owner)
   *     description: Update the restaurant information associated with the authenticated owner
   *     tags:
   *       - Restaurants
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Restaurant updated successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Not restaurant owner
   */
  async updateMyRestaurantByOwner(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError("User not authenticated", ERR.UNAUTHORIZED);
      }

      const updated = await RestaurantService.updateRestaurantByOwnerId(userId, req.body || {});
      return SUCCESS_RESPONSE.success(res, 'Update restaurant successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /users/owner/restaurant/payment-qr:
   *   patch:
   *     summary: Upload or update restaurant payment QR code (owner)
   *     description: Allows restaurant owners to upload or update their restaurant's payment QR code.
   *     tags:
   *       - Restaurants
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Payment QR updated successfully
   *       401:
   *         description: Unauthorized
   */
  async uploadMyPaymentQrByOwner(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new ERR_RESPONSE.UnauthorizedError("User not authenticated", ERR.UNAUTHORIZED);
      }

      const file = req.file;
      if (!file) {
        throw new ERR_RESPONSE.BadRequestError("File is required", ERR.INVALID_INPUT);
      }

      const updated = await RestaurantService.uploadPaymentQrByOwnerId(userId, file);
      return SUCCESS_RESPONSE.success(res, 'Payment QR updated successfully', updated);
  } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /restaurants/recommend:
   *   get:
   *     summary: Get recommended restaurants
   *     description: Get top 5 restaurants with highest ratings
   *     tags:
   *       - Restaurants
   *     responses:
   *       200:
   *         description: Recommended restaurants retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   */
  async getRecommend(req, res, next) {
    try {
      const data = await RestaurantService.getRecommend();
      return SUCCESS_RESPONSE.success(res, 'Get recommend successfully', data);
    } catch (err) {
      next(err);
    }
  }

  // [GET] /users/me/restaurants
  async getMyRestaurants(req, res, next) {
    try {
      const userId = req.userId;
      const restaurants = await RestaurantService.getRestaurantsByOwnerId(userId);

      return SUCCESS_RESPONSE.success(res, 'Fetch My Restaurants Successfully"', restaurants);
    } catch (err) {
      next(err);
    }
  } 

  // [PATCH] /me/restaurants/:restaurantId
  async updateMyRestaurant(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const updateData = req.body;

      const result = await RestaurantService.updateMyRestaurant(restaurantId, updateData);
      return SUCCESS_RESPONSE.success(res, "Update Restaurant Successfully", result);
    } catch (err) {
      next(err);
    }
  }

  // [PATCH] /me/restaurant/:restaurantId/payment-qr
  async uploadMyPaymentQr(req, res, next) {
    try {
      if (!req.file) throw new ERR_RESPONSE.BadRequestError("Please upload a QR image");

      const { restaurantId } = req.params;
      const filePath = req.file.path;

      const result = await RestaurantService.uploadPaymentQr(restaurantId, filePath);
      return SUCCESS_RESPONSE.success(res, "Upload Payment QR Successfully", result);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new RestaurantController();