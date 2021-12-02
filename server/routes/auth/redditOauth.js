const express = require("express");

var router = express.Router();

const passport = require('passport');
var RedditStrategy = require('passport-reddit').Strategy;

const User = require("./../../db/models/User.model");

var crypto = require('crypto')

require('dotenv').config();

passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/reddit/callback",
    scope: ['identity', 'edit', 'flair', 'history', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    req.session.refreshToken = refreshToken;
    return done(null, profile);
  }
));

module.exports = router.get('/auth/reddit', function(req, res, next) {
  req.session.state = crypto.randomBytes(32).toString('hex');
  req.session.email = req.query.email;
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent',
  })(req, res, next);
})

module.exports = router.get('/auth/reddit/callback',passport.authenticate('reddit'),
async function(req, res) {
  const userLogged = await User.findOneAndUpdate({email: req.session.email}, {$set:{redditRefreshToken: req.session.refreshToken}}, function(err, doc) {
    if (err){
      console.log("Something wrong when updating data!");
    }
  });
  res.redirect('http://localhost:3000/settings');
});