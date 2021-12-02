const express = require("express");

var router = express.Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require("./../../db/models/User.model");

require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    await User.findOne({ email: profile._json.email },function(err,result) { 
      if (!result) {
        const user = new User({ username: profile._json.name, email: profile._json.email});
        user.save().then(() => console.log("User created"));
      }
    });
    req.session.email = profile._json.email;
    return done(null, profile);
  }
));

module.exports = router.get('/auth/google', function(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] })(req, res, next);
})

module.exports = router.get('/auth/google/callback',passport.authenticate('google'),
async function(req, res) {
  res.redirect('http://localhost:3000/dashboard/google/redirect/' + req.session.email);
});