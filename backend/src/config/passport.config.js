const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('../services/user.service');
/**
 * done: hàm callback phải gọi khi logic kết thúc, cú pháp thường là done(error, user)
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
    },
    async (accessToken, _, profile, done) => {
      console.log('verifing....');
      try {
        const email = profile.emails?.[0]?.value || null;
        const avatar = profile.photos?.[0]?.value || null;
        const emailVerified = Boolean(profile._json?.email_verified);
        const googleId = profile.id;

        const provider = 'google';
        const providerId = googleId;
        const emailAtProvider = email;
        const avatarUrl = avatar;
        
        // tìm người dùng đã đăng kí với providerId đó 
        let user = await UserService.findByProviderId(provider, googleId);

        // Nếu đã có
        if (user) {
          // đã xác thực email
          if (user.emailVerifiedAt) {
            return done(null, { status: 'LOGIN_SUCCESS', userId: user._id.toString() });
          } else {
            // nếu chưa verify email thì verify tại thời điểm hiện tại
            await UserService.markEmailVerified(user._id, email);
            return done(null, { status: 'LOGIN_SUCCESS', userId: user._id.toString() });
          }
        } 

        // nếu chưa có provider
        // tìm user theo email
        let existingUser = await UserService.findByEmail(email);
        // nếu có user theo email đó
        if (existingUser) {
          // nếu email đã verify 
          if (existingUser.emailVerifiedAt) {
            await UserService.updateProviderById(existingUser._id,
              {
                provider, providerId, emailAtProvider, avatarUrl
              }
            );
            return done(null, { status: 'LOGIN_SUCCESS', userId: existingUser._id.toString() });
          } else {
            // email chưa verify
            await UserService.markEmailVerified(existingUser._id, email);
            await UserService.updateProviderById(existingUser._id);
            return done(null, { status: 'LOGIN_SUCCESS', userId: existingUser._id.toString() });
          }
        } else {
          // chưa có user nào đăng kí với email đó
          // tạo mới user nhưng phone thì null
          const newUser = await UserService.createUser(
            {
              email, 
              emailVerifiedAt: new Date(),
              providers: [
                { provider, providerId, emailAtProvider, avatarUrl }
              ],
              status: 'pending',
            }
          );

          return done(null, { status: 'REQUIRE_PHONE_USERNAME_PASSWORD', userId: newUser._id.toString() });
        }
      } catch (err) {
      return done(err);
    }
  }
  )
);