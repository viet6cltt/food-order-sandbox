
const TOKEN_CONFIG = {
  ACCESS: { type: 'access', secret: process.env.JWT_ACCESS_SECRET, expiry: '15m' },
  REFRESH: { type: 'refresh', secret: process.env.JWT_REFRESH_SECRET, expiry: '7d' },
  EMAIL_VERIFY: { type: 'verify_email', secret: process.env.JWT_EMAIL_VERIFY_SECRET, expiry: '2h' },
  RESET_PASSWORD: { type: 'reset_password', secret: process.env.JWT_RESET_PASSWORD_SECRET, expiry: '1h' },
  OAUTH_LINK : { type: 'oauth_link', secret: process.env.JWT_OAUTH_LINK_SECRET, expiry: '10m' },
}

function getTokenConfig() {
  return TOKEN_CONFIG;
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

function convertExpiryToMinutes(expiryString) {
  if (!expiryString) return 0;
  
  const match = expiryString.match(/^(\d+)([smhd])$/); 
  if (!match) {
    console.warn(`Invalid expiry format: ${expiryString}. Assuming minutes.`);
    return parseInt(expiryString, 10) || 0; 
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'm':
      return value;
    case 'h':
      return value * 60;
    case 'd':
      return value * 60 * 24;
    case 's':
      return Math.ceil(value / 60);
    default:
      return value;
  }
}

module.exports = {
  getTokenConfig,
  calculateExpiresAt,
  convertExpiryToMinutes,
}