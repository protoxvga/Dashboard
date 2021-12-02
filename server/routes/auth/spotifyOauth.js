const express = require("express");

var router = express.Router();

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const User = require("./../../db/models/User.model");

require('dotenv').config();

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/spotify/callback",
  passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    req.session.refreshToken = refreshToken;
    req.session.accessToken = accessToken;
    return done(null, profile);
  }
));

module.exports = router.get('/auth/spotify', function(req, res, next) {
  req.session.email = req.query.email;
  passport.authenticate('spotify')(req, res, next);
})

module.exports = router.get('/auth/spotify/callback', passport.authenticate('spotify'),
async function(req, res) {
  const userLogged = await User.findOneAndUpdate({email: req.session.email}, {$set:{spotifyRefreshToken: req.session.refreshToken, spotifyAccessToken: req.session.accessToken}}, function(err, doc){
    if (err){
      console.log("Something wrong when updating data!");
    }
  });
  res.redirect('http://localhost:3000/settings');
});