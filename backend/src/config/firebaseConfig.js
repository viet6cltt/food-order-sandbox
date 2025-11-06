const admin = require("firebase-admin");

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// // Dùng cho production: Khởi tạo Firebase Admin SDK (dùng để verify ID Token) 
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// Nếu đang chạy trong môi trường emulator thì dùng config riêng
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.log("🔥 Using Firebase Auth Emulator:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"; // 👈 port emulator
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


module.exports = admin;