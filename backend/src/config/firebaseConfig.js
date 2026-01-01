const admin = require("firebase-admin");

//Thay đổi Firebase_project_id và firebase_client_email theo config firebase cá nhân trong .env
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
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
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
} else {
  const hasServiceAccount =
    Boolean(serviceAccount.projectId) &&
    Boolean(serviceAccount.clientEmail) &&
    Boolean(serviceAccount.privateKey);

  if (!hasServiceAccount) {
    console.warn(
      '[firebase-admin] FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY not fully set; Firebase Admin not initialized.'
    );
  } else if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}


module.exports = admin;