const repo = require('@/repositories/review.repository');
const ERR = require('@/utils/httpErrors');

class AdminReviewService {
  async hideReview(id) {
    const review = repo.findById(id);
    if (!review) throw new ERR.NotFoundError("Review Not Found");

    if (review.status !== "PUBLISHED") {
      throw new ERR.UnprocessableEntityError("Only PUBLISHED review can be hided");
    }

    return await repo.updateStatus(id, "HIDDEN");
  }
  
  async deleteReview(id) {
    const review = repo.findById(id);
    if (!review) throw new ERR.NotFoundError("Review Not Found");

    return await repo.deleteById(id);
  }
}

module.exports = new AdminReviewService();