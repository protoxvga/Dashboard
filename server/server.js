const express = require("express");

const connectDb = require("./db/Connection");
const aboutFile = require('./files/about.json');

const userHandling = require('./routes/userHandling');

const githubApi = require('./routes/api/githubApi');
const spotifyApi = require('./routes/api/spotifyApi');
const redditApi = require('./routes/api/redditApi');

const googleOauth = require('./routes/auth/googleOauth');
const spotifyOauth = require('./routes/auth/spotifyOauth');
const redditOauth = require('./routes/auth/redditOauth');
const githubOauth = require('./routes/auth/githubOauth');

const cookieSession = require('cookie-session')

const passport = require('passport');

const bodyParser = require('body-parser');
const cors = require('cors');

const User = require("./db/models/User.model");

const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'spotify-auth-session',  
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session({ secret: 'anything' }));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//User Login / Register

app.post('/api/user-create', userHandling);
app.post('/api/user-login', userHandling);

//google oauth setup

app.get('/auth/google', googleOauth);
app.get('/auth/google/callback', googleOauth);

// spotify oauth setup

app.get('/auth/spotify', spotifyOauth);
app.get('/auth/spotify/callback', spotifyOauth);

//spotify Api calls

app.post('/api/spotify/track', spotifyApi);
app.post('/api/spotify/album', spotifyApi);

//github oauth setup

app.get('/auth/github', githubOauth);
app.get('/auth/spotify/github', githubOauth);

//github Api

app.post('/api/github/user', githubApi);
app.post('/api/github/repo', githubApi);

//reddit Oauth setup

app.get('/auth/reddit', redditOauth);
app.get('/auth/reddit/callback', redditOauth);

// reddit call api

app.post('/api/reddit/subbreddit', redditApi);
app.post('/api/reddit/subscribers', redditApi);

//about.json file route

app.get('/about.json', function(req, res) {
    res.header("Content-Type",'application/json');
    var changedFile = aboutFile;
    changedFile.client.host = req.connection.remoteAddress.substring(7, req.connection.remoteAddress.length);
    changedFile.server.current_time = Date.now();
    res.send(JSON.stringify(changedFile, null, 4));
});

app.listen(8080, function() {
    console.log(`listening on http://localhost:8080/`);
    connectDb();
});