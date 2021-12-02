var express = require('express');
var router = express.Router();

var GitHub = require('github-api');

const User = require("./../../db/models/User.model");

module.exports = router.post('/api/github/repo', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  if (req.body.repo === "")
    return;

  try {
    var gh = new GitHub({
      token: userLogged.githubAccessToken
    });
    let user = await gh.getUser();
    let profile = await user.getProfile();
    let repo = await gh.getRepo(profile.data.login, req.body.repo);
    let commits = await repo.listCommits();
    let date = new Date(commits.data[0].commit.committer.date);
    res.send({ callback: "success", author: commits.data[0].commit.committer.email, message: commits.data[0].commit.message, date: date.toLocaleDateString('en-GB')})
  }
  catch (error) {
    res.send({ callback: "error" });
  }
});

module.exports = router.post('/api/github/user', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  if (req.body.search === "")
    return;

  try {
    var gh = new GitHub({
      token: userLogged.githubAccessToken
    });
    var user = await gh.getUser(req.body.search);
    let repos = await user.getProfile()
    .then(function({data: reposJson}) {
      res.send({ callback: "success", user: reposJson });
    });
  }
  catch (error) {
    res.send({ callback: "error" });
  }
});