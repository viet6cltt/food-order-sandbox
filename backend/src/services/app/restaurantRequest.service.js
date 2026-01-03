const repoRestaurantRequest = require('@/repositories/restaurantRequest.repository');
const ERR_RESPONSE = require('@/utils/httpErrors');
const ERR = require('@/constants/errorCodes');
const cloudinary = require('@/config/cloudinary.config');
const fs = require('fs');

class RestaurantRequestService {
  
  async getMyRequest(userId) {
    const requests = await repoRestaurantRequest.getByUserId(userId);

    if (!requests || requests.length === 0) return [];

    const statusPriority = {
      'pending': 1,
      'rejected': 2,
      'approved': 3
    };

    return requests.sort((a, b) => {
      const priorityA = statusPriority[a.status] || 99;
      const priorityB = statusPriority[b.status] || 99;

      // 1. Nếu độ ưu tiên khác nhau -> Sắp xếp theo độ ưu tiên
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // 2. Nếu cùng độ ưu tiên -> Sắp xếp theo thời gian (Mới nhất lên đầu)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  async submitRequest(userId, data, files) {
    // check trùng lặp
    const exists = await repoRestaurantRequest.getByUserId(userId);
    if (exists) {
      this._cleanupFiles(files);
      throw new ERR_RESPONSE.UnprocessableEntityError("This user already has a pending request");
    }

    const uploadData = { ...data, userId };

    try {
      // upload banner
      if (files?.banner?.[0]) {
        const bannerFile = files.banner[0];
        const bannerRes = await cloudinary.uploader.upload(bannerFile.path, {
          folder: `food-order/requests/${userId}/banner`,
          public_id: `banner-${Date.now()}`,
          overwrite: true,
        });

        uploadData.bannerUrl = bannerRes.secure_url;  

        // delelte temp files
        fs.unlinkSync(bannerFile.path);
      }

      // upload documents
      if (files?.documents?.length > 0) {
        const uploadPromises = files.documents.map(async (file, index) => {
          const docRes = await cloudinary.uploader.upload(file.path, {
            folder: `food-order/requests/${userId}/documents`,
            public_id: `doc-${index}-${Date.now()}`,
          });
          // Xóa file tạm ngay sau khi mỗi file upload thành công
          fs.unlinkSync(file.path);
          return docRes.secure_url;
        });

        uploadData.documents = await Promise.all(uploadPromises);
      }

      return await repoRestaurantRequest.createRequest(uploadData);
    } catch (err) {
      this._cleanupFiles(files);
      throw err;
    }
  }

  // helper để dọn dẹp file
  _cleanupFiles(files) {
    if (!files) return;
    const allFiles = [...(files.banner || []), ...(files.documents || [])];
    allFiles.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
}

module.exports = new RestaurantRequestService();