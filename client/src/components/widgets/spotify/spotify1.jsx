import React, { useState, useEffect } from 'react';

import "./../../style/spotify.css";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useSelector } from 'react-redux'

import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Spotify1(props) {
    const Email = useSelector((state) => state.email);
    const lastartist = JSON.parse(localStorage.getItem('artist' + props.id)) || '';
    const [artist, setartist] = useState(lastartist);
    const lastfollowers = JSON.parse(localStorage.getItem('followers' + props.id)) || 0;
    const [followers, setfollowers] = useState(lastfollowers);
    const lastavatar = JSON.parse(localStorage.getItem('avatar' + props.id)) || "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
    const [avatar, setavatar] = useState(lastavatar);
    const [open, setOpen] = React.useState(false);
    const lastheader = JSON.parse(localStorage.getItem('header' + props.id)) || "Artist Followers";
    const [header, setheader] = useState(lastheader);

    useEffect(() => {
        localStorage.setItem("artist" + props.id, JSON.stringify(artist));
        localStorage.setItem("header" + props.id, JSON.stringify(header));
        localStorage.setItem("avatar" + props.id, JSON.stringify(avatar));
        localStorage.setItem("followers" + props.id, JSON.stringify(followers));
    }, [header, avatar, artist, followers, props.id]);

    useEffect(()=>{
        var handle=setInterval(getAlbumInfo, 60000);    

        return ()=>{
            clearInterval(handle);
        }
    });

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function getAlbumInfo() {
        axios.post('http://localhost:8080/api/spotify/album', {
            email: Email,
            search: artist,
        }).then(function (response) {
            if (response.data.callback === "success") {
                setfollowers(response.data.followers);
                setavatar(response.data.avatar);
                setheader(response.data.name);
            } else {
                handleClick();
            }
        });
    }

    return (
        <div className="widgetSpotify" >
            <div className="align">
                <h1>{header}</h1>
                <Avatar
                    src={avatar}
                    style={{height: '80px', width: '80px', left: "138px", top: '10px'}}
                />
                <h1 style={{marginTop: 20}}>{Intl.NumberFormat().format(followers)} Followers</h1>
                <TextField
                    variant="outlined"
                    style={{marginTop: '20px'}}
                    label="Artist"
                    type="text"
                    autoComplete="off"
                    value={artist}
                    onChange={(e) => setartist(e.target.value)}
                    inputProps={{ style: { fontFamily: 'Roboto', color: 'white' } }}
                />
                <br />
                <Button style={{marginTop: '20px'}} variant="outlined" onClick={getAlbumInfo}>Search</Button>
                <Snackbar style={{left: "70px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Please link your account
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}