import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    const photoURL = profile.photos && profile.photos[0] && profile.photos[0].value;
    if (!user) {
      user = await User.create({ email: profile.emails[0].value, password: 'oauth_google', photoURL });
    } else if (photoURL && user.photoURL !== photoURL) {
      user.photoURL = photoURL;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));



export default passport;
