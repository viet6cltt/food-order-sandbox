const providersConfig = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth', // auth endpoint của gg
    clientId: process.env.GOOGLE_CLIENT_ID, // mã định danh gg cấp cho ứng dụng
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback', // URL gg sẽ chuyển hướng sau khi xác thực thành công
    scope: ['profile', 'email'], // phạm vi truy cập, ở đây là profile và email
    responseType: 'code', // gg sẽ trả lại code ủy quyền, BE dùng code để đổi lấy access Token trên server của GG
    extras: {
      include_granted_scopes: 'true',
      access_type: 'offline', // offline -> yêu cầu thêm refresh token
      prompt: 'select_account',
    }
  }
}

module.exports = providersConfig;