const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

function initialize(passport) {
  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.SERVER_URL + "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return cb(null, user);
        } else {
          const newUser = new User({
            nom: profile.name.familyName,
            prenom: profile.name.givenName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
          await newUser.save();
          return cb(null, newUser);
        }
      }
    )
  );

  // Github Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.SERVER_URL + "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return cb(null, user);
        } else {
          const newUser = new User({
            nom: profile.username,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
          await newUser.save();
          return cb(null, newUser);
        }
      }
    )
  );

  // Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.SERVER_URL + "/api/auth/facebook/callback",
        profileFields: ["id", "emails", "name", "picture.type(large)"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return cb(null, user);
        } else {
          const newUser = new User({
            nom: profile.name.familyName,
            prenom: profile.name.givenName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
          await newUser.save();
          return cb(null, newUser);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, next) => {
        const user = await User.findOne({ email });
        if (user == null) {
          return next(null, null);
        }

        try {
          if (bcrypt.compareSync(password, user.password)) {
            return next(null, user);
          } else {
            return next(null, null);
          }
        } catch (e) {
          return next(e, null);
        }
      }
    )
  );

  passport.serializeUser((user, next) => next(null, user.id));
  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      next(null, user);
    } catch (err) {
      next(err);
    }
  });
}

module.exports = initialize;
