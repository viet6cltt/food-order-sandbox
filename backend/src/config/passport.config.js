const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('@/services/app/user.service');
/**
 * done: hàm callback phải gọi khi logic kết thúc, cú pháp thường là done(error, user)
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

if (!googleClientId || !googleClientSecret) {
  console.warn(
    '[passport] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set; Google OAuth strategy disabled.'
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
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
          let existingUser = email ? await UserService.findByEmail(email) : null;
          // nếu có user theo email đó
          if (existingUser) {
            // nếu email đã verify 
            if (existingUser.emailVerifiedAt) {
              await UserService.updateProviderById(existingUser._id, {
                provider,
                providerId,
                emailAtProvider,
                avatarUrl,
              });
              return done(null, { status: 'LOGIN_SUCCESS', userId: existingUser._id.toString() });
            } else {
              // email chưa verify
              await UserService.markEmailVerified(existingUser._id, email);
              await UserService.updateProviderById(existingUser._id, {
                provider,
                providerId,
                emailAtProvider,
                avatarUrl,
              });
              return done(null, { status: 'LOGIN_SUCCESS', userId: existingUser._id.toString() });
            }
          } else {
            // chưa có user nào đăng kí với email đó
            // tạo mới user nhưng phone thì null
            // NOTE: Some MongoDB unique indexes treat missing fields as null.
            // To avoid E11000 dup key on username/email in existing DB indexes,
            // always provide a unique placeholder for OAuth-created accounts.
            const safeEmail = email || `google_${googleId}@noemail.local`;
            const safeUsername = `google_${googleId}`.toLowerCase();

            const newUser = await UserService.createUser({
              username: safeUsername,
              email: safeEmail,
              emailVerifiedAt: emailVerified ? new Date() : new Date(),
              providers: [{ provider, providerId, emailAtProvider, avatarUrl }],
              status: 'pending',
            });

            return done(null, {
              status: 'REQUIRE_PHONE_USERNAME_PASSWORD',
              userId: newUser._id.toString(),
            });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

module.exports = passport;