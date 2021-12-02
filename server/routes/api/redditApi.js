var express = require('express');
var router = express.Router();

const snoowrap = require('snoowrap');

const User = require("./../../db/models/User.model");

module.exports = router.post('/api/reddit/subbreddit', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  if (req.body.search === "")
    return;

  try {
    const reddit = new snoowrap({
      userAgent: userLogged.email,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: userLogged.redditRefreshToken
    });
  
    let subredd = await reddit.getSubreddit(req.body.search).fetch().catch((error) => {return ;});
    let send = await reddit.getSubreddit(req.body.search).getNew({limit: 2}).map(post => ({callback: "success", avatar: subredd.community_icon, text: post.selftext, title: post.title, date: post.created, subreddit_name: post.subreddit_name_prefixed, user_name: post.author.name, url: post.url })).catch((error) => {return ;});
    res.send(send);
  }
  catch (error) {
    res.send({ callback: "error" });
    return;
  }
});

module.exports = router.post('/api/reddit/subscribers', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  if (req.body.search === "")
    return;

  try {
    const reddit = new snoowrap({
      userAgent: userLogged.email,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: userLogged.redditRefreshToken
    });
  
    let subredd = await reddit.getSubreddit(req.body.search).fetch().catch((error) => {return ;});
    res.send([{ callback: "success", avatar: subredd.community_icon, subscribers: subredd.subscribers }]);
  }
  catch (error) {
    res.send({ callback: "error" });
    return;
  }
});