const redisClient = require('@/config/redisClient.config');

class RedisService {
  /**
   * Đưa token vào danh sách đen (Dùng cho Logout)
   * @param {string} token - Access Token cần chặn
   * @param {number} expirySeconds - Thời gian còn lại của token (giây)
   */
  async setBlacklist(token, expirySeconds) {
    if (expirySeconds <= 0) return;
    
    try {
      // Key: bl_ + token, Value: 1, EX: Hết hạn sau x giây
      await redisClient.set(`bl_${token}`, '1', {
        EX: Math.floor(expirySeconds)
      });
      console.log(`Token blacklisted for ${expirySeconds}s`);
    } catch (err) {
      console.error('Redis Set Error:', err);
    }
  }

  /**
   * Kiểm tra token có bị chặn hay không (phục vụ Logout)
   * @param {string} token 
   * @returns {boolean}
   */
  async isBlacklisted(token) {
    try {
      const result = await redisClient.get(`bl_${token}`);
      return result !== null; // Nếu tìm thấy (khác null) nghĩa là bị chặn
    } catch (err) {
      console.error('Redis Get Error:', err);
      return false;
    }
  }

  // Phục vụ cho đổi role
  async setForceRefresh(userId, expirySeconds = 3600) {
    try {
      // Key: fr_ + userId
      await redisClient.set(`fr_${userId}`, '1', {
        EX: expirySeconds
      });
      console.log(`userId force refresh for ${expirySeconds}s`);
    } catch (err) {
      console.error('Redis SetForceRefresh Error', err);
    }
  }
  
  async shouldForceRefresh(userId) {
    try {
      const result = await redisClient.get(`fr_${userId}`);
      return result !== null;
    } catch (err) {
      return false;
    }
  }

  async deleteForceRefresh(userId) {
    try {
      await redisClient.del(`fr_${userId}`);
    } catch (err) {
      console.error('Redis DelForceRefresh Error:', err);
    }
  }
}

module.exports = new RedisService();