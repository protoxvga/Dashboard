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

export default function Spotify2(props) {
    const Email = useSelector((state) => state.email);
    const lasttrack = JSON.parse(localStorage.getItem('track' + props.id)) || "";
    const [track, settrack] = useState(lasttrack);
    const [open, setOpen] = React.useState(false);
    const lastPlaylistTitle = JSON.parse(localStorage.getItem('title' + props.id)) || "";
    const [title, settitle] = useState(lastPlaylistTitle);
    const lastavatar = JSON.parse(localStorage.getItem('avatar' + props.id)) || "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
    const [avatar, setavatar] = useState(lastavatar);
    const lastdescription = JSON.parse(localStorage.getItem('description' + props.id)) || "";
    const [description, setdescription] = useState(lastdescription);
    const lasthref = JSON.parse(localStorage.getItem('href' + props.id)) || "";
    const [href, sethref] = useState(lasthref);
    const lastnbr = JSON.parse(localStorage.getItem('number' + props.id)) || 0;
    const [number, setnumber] = useState(lastnbr);

    useEffect(() => {
        localStorage.setItem("title" + props.id, JSON.stringify(title));
        localStorage.setItem("avatar" + props.id, JSON.stringify(avatar));
        localStorage.setItem("description" + props.id, JSON.stringify(description));
        localStorage.setItem("href" + props.id, JSON.stringify(href));
        localStorage.setItem("number" + props.id, JSON.stringify(number));
        localStorage.setItem("track" + props.id, JSON.stringify(track));
    }, [title, track, avatar, description, href, number, props.id]);

    useEffect(()=>{
        var handle=setInterval(getTrackInfo, 20000);

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

    function openLink() {
        if (href !== "") {
            window.open(href, '_blank');
        } else {
            handleClick();
        }
    }

    function getTrackInfo() {
        axios.post('http://localhost:8080/api/spotify/track', {
            email: Email,
            search: track,
        }).then(function (response) {
            if (response.data.callback === "success") {
                settitle(response.data.name);
                setavatar(response.data.avatar);
                setdescription(response.data.description);
                sethref(response.data.href);
                setnumber(response.data.tracks);
            } else {
                handleClick();
            }
        });
    }

    return (
        <div className="widgetSpotify" >
            <div className="align">
                <Avatar
                    src={avatar}
                    style={{height: '80px', width: '80px', left: "138px", top: '10px'}}
                />
                <h1 style={{marginTop: 20}}>{title}</h1>
                <p style={{marginTop: 10}}>{description}</p>
                <TextField
                    variant="outlined"
                    style={{marginTop: '20px'}}
                    label="Playlist"
                    type="text"
                    autoComplete="off"
                    value={track}
                    onChange={(e) => settrack(e.target.value)}
                    inputProps={{ style: { fontFamily: 'Roboto', color: 'white' } }}
                />
                <br />
                <h1 style={{marginTop: '5px'}}>{number} Track(s)</h1>
                <div style={{display: 'row', marginTop: '5px'}}>
                    <Button style={{marginLeft: '20px', marginRight: '20px'}} variant="outlined" onClick={getTrackInfo}>Search</Button>
                    <Button style={{marginLeft: '20px', marginRight: '20px'}} variant="outlined" onClick={openLink}>Go to</Button>
                </div>
                <Snackbar style={{left: "70px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Please link your account
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}