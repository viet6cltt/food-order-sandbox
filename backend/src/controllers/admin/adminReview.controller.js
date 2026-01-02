const service = require('@/services/admin/adminReview.service');
const ERR_RESPONSE = require('@/utils/httpErrors.js');
const ERR = require('@/constants/errorCodes');
const SUCCESS = require('@/utils/successResponse');

class AdminReviewController {

  /**
   * @swagger
   * /admin/reviews/{reviewId}/hide:
   *   patch:
   *     summary: Hide a review
   *     description: Hide a published review from public view (changes status to HIDDEN)
   *     tags:
   *       - Admin Reviews
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: reviewId
   *         in: path
   *         required: true
   *         description: Review ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Review hidden successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Hide review successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     userId:
   *                       type: string
   *                     orderId:
   *                       type: string
   *                     restaurantId:
   *                       type: string
   *                     rating:
   *                       type: number
   *                     comment:
   *                       type: string
   *                     status:
   *                       type: string
   *                       enum: [PUBLISHED, HIDDEN, REMOVED]
   *                       example: HIDDEN
   *                     images:
   *                       type: array
   *                       items:
   *                         type: string
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Bad request - Missing review ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Review not found
   *       422:
   *         description: Unprocessable entity - Only published reviews can be hidden
   */
  async hideReview(req, res, next) {
    try {
      const { reviewId } = req.params;

      if (!reviewId) throw new ERR_RESPONSE.BadRequestError("Missing reviewId");

      const review = await service.hideReview(reviewId);
      return SUCCESS.success(res, "Hide review successfully", review);

    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /admin/reviews/{reviewId}:
   *   delete:
   *     summary: Delete a review
   *     description: Permanently delete a review and all associated data
   *     tags:
   *       - Admin Reviews
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: reviewId
   *         in: path
   *         required: true
   *         description: Review ID
   *         schema:
   *           type: string
   *           example: 507f1f77bcf86cd799439011
   *     responses:
   *       202:
   *         description: Review deletion accepted and processing
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Hide review successfully
   *       400:
   *         description: Bad request - Missing review ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Admin access required
   *       404:
   *         description: Not found - Review not found
   */
  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;

      if (!reviewId) throw new ERR_RESPONSE.BadRequestError("Missing reviewId");

      await service.deleteReview(reviewId);
      return SUCCESS.accepted(res, "Hide review successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminReviewController();
