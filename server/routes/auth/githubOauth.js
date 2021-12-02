const express = require("express");

var router = express.Router();

const passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

const User = require("./../../db/models/User.model");

require('dotenv').config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    req.session.refreshToken = refreshToken;
    req.session.accessToken = accessToken;
    return done(null, profile);
  }
));

module.exports = router.get('/auth/github', function(req, res, next) {
  passport.authenticate('github', {
    duration: 'permanent',
  })(req, res, next);
})

module.exports = router.get('/auth/github/callback', passport.authenticate('github'),
async function(req, res) {
  const userLogged = await User.findOneAndUpdate({email: req.session.email}, {$set:{githubRefreshToken: req.session.refreshToken, githubAccessToken: req.session.accessToken}}, function(err, doc){
    if (err){
      console.log("Something wrong when updating data!");
    }
  });
  res.redirect('http://localhost:3000/settings');
});