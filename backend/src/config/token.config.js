const ACCESS_TOKEN_EXPIRY = '15m'; 
const REFRESH_TOKEN_EXPIRY = '7d';

function getAccessTokenExpiry() {
  return ACCESS_TOKEN_EXPIRY;
}

function getRefreshTokenExpiry() {
  return REFRESH_TOKEN_EXPIRY;
}

function calculateExpiresAt(expiryString) {
  const unit = expiryString.slice(-1);
  const value = parseInt(expiryString.slice(0, -1));
  let ms = 0;

  switch (unit) {
    case 's': ms = value * 1000; break;
    case 'm': ms = value * 60 * 1000; break;
    case 'h': ms = value * 60 * 60 * 1000; break;
    case 'd': ms = value * 24 * 60 * 60 * 1000; break;
    default: ms = 0; // Xử lý lỗi nếu cần
  }

  return new Date(Date.now() + ms);
}

module.exports = {
  getAccessTokenExpiry,
  getRefreshTokenExpiry,
  calculateExpiresAt,
};