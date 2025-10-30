
const admin = require('../config/firebaseConfig');
const UserService = require('./user.service');

const hashPassword = require('../utils/hashPassword');


/**
 * Xử lý đăng ký người dùng sau khi xác minh Firebase OTP thành công
 * @param {string} username 
 * @param {string} password 
 * @param {string} idToken  (Firebase ID Token từ frontend)
 */
async function registerWithFirebase({ username, password, idToken }) {
  //  Xác minh ID token do Firebase gửi về 
  const decoded = await admin.auth().verifyIdToken(idToken);
  const phone = decoded.phone_number;

  if (!phone) {
    throw new Error('Phone number not found in Firebase token');
  }

  // Kiểm tra trùng username / phone
  const existingUser = await UserService.findByUsernameOrPhone(username, phone);
  if (existingUser) {
    throw new Error('Username or phone already exists');
  }

  // Hash password
  const passwordHash = await hashPassword.hashPassword(password);

  // Tạo user mới (đã verify sẵn số điện thoại)
  const newUser = await UserService.createUser({
    username,
    passwordHash,
    phone,
    phoneVerifiedAt: new Date(),
    providers: [{ provider: 'firebase' }],
  });

  // 5️⃣ Trả response
  return {
    success: true,
    message: 'User registered & verified via Firebase',
    data: {
      username,
      phone,
    },
  };
}


module.exports = { registerWithFirebase, };