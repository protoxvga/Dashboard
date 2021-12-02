import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import RedditIcon from '@mui/icons-material/Reddit';
import { FaSpotify } from 'react-icons/fa';
import GitHubIcon from '@mui/icons-material/GitHub';

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

import './style/settings.css';

require('dotenv').config();

const Settings = () => {
    const email = useSelector((state) => state.email);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function disconnectHandling() {
        dispatch({type: 'USER_LOGIN', email: ""});
        navigate('/');
    }

    function saveHandling() {
        navigate('/dashboard');
    }

    const githubOauth = () => {
        const url = 'http://localhost:8080/auth/github/?email=' + email;
        window.open(url);
    };

    const spotifyOauth = () => {
        const url = 'http://localhost:8080/auth/spotify/?email=' + email;
        window.open(url);
    };

    const redditOauth = () => {
        const url = 'http://localhost:8080/auth/reddit/?email=' + email;
        window.open(url);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className="container">
                <h1>Settings</h1>
                <h1 style={{fontFamily: 'Roboto', fontSize: 20}}>Email : {email}</h1>
                <div className="spotifyOauth">
                    <FaSpotify id="SpotifyIcon" size="55" style={{color: '#fff'}} />
                    <h1 id="CardText">Spotify</h1>
                    <Button id="InstagramButton" variant="contained" size="large" onClick={spotifyOauth} color="success">Link</Button>
                </div>
                <div className="redditOauth">
                    <RedditIcon id="RedditIcon" sx={{ fontSize: 60 }} style={{color: '#fff'}} />
                    <h1 id="CardText">Reddit</h1>
                    <Button id="SpotifyButton" variant="contained" size="large" onClick={redditOauth} color="success">Link</Button>
                </div>
                <div className="githubOauth">
                    <GitHubIcon id="RedditIcon" sx={{ fontSize: 60 }} style={{color: '#fff'}} />
                    <h1 id="CardText">GitHub</h1>
                    <Button id="SpotifyButton" variant="contained" size="large" onClick={githubOauth} color="success">Link</Button>
                </div>
                <div className="buttonContainer">
                    <Button id='button' variant="outlined" size="large" color="success" onClick={saveHandling}>Save</Button>
                    <Button id='button' variant="outlined" size="large" color="error" onClick={disconnectHandling}>Disconnect</Button>
                </div>
            </div>
        </Box>
    );
}

export default Settings;