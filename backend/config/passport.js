const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Account } = require('../db');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/v1/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;

                    // Check if user exists
                    let user = await User.findOne({ username: email });

                    if (user) {
                        // User exists, just return
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        username: email,
                        firstName: profile.name.givenName || 'User',
                        lastName: profile.name.familyName || '',
                        password: 'google-oauth-' + Math.random().toString(36),
                        isVerified: true, // Google verifies email
                        googleId: profile.id
                    });

                    // Create account for new user
                    await Account.create({
                        userId: user._id,
                        balance: 1 + Math.random() * 10000
                    });

                    done(null, user);
                } catch (error) {
                    console.error('Google OAuth error:', error);
                    done(error, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
