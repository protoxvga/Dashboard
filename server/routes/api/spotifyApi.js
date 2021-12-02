var express = require('express');
var router = express.Router();

var SpotifyWebApi = require('spotify-web-api-node');

const User = require("./../../db/models/User.model");

module.exports = router.post('/api/spotify/album', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  var spotifyApi = new SpotifyWebApi({
    accessToken: userLogged.spotifyAccessToken
  });
  spotifyApi.searchArtists(req.body.search)
  .then(function(data) {
    res.send({ callback: "success", name: data.body.artists.items[0].name, followers: data.body.artists.items[0].followers.total, avatar: data.body.artists.items[0].images[1].url});
  }, function(err) {
    res.send({ callback: "error" });
  });
});

module.exports = router.post('/api/spotify/track', async function(req, res) {
  const userLogged = await User.findOne({ email: req.body.email });

  var spotifyApi = new SpotifyWebApi({
    accessToken: userLogged.spotifyAccessToken
  });
  spotifyApi.searchPlaylists(req.body.search)
  .then(function(data) {
    res.send({ callback: "success", name: data.body.playlists.items[0].name, description: data.body.playlists.items[0].description, href: data.body.playlists.items[0].external_urls.spotify, avatar: data.body.playlists.items[0].images[0].url, tracks: data.body.playlists.items[0].tracks.total});
  }, function(err) {
    res.send({ callback: "error" });
  });
});