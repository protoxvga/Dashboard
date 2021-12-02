import React, { useState, useEffect } from 'react';

import "./../../style/github.css";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';
import MuiAlert from '@mui/material/Alert';

import { useSelector } from 'react-redux'

import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Github1(props) {
    const Email = useSelector((state) => state.email);
    const lastfollowers = localStorage.getItem('followers' + props.id) || 0;
    const [followers, setfollowers] = useState(lastfollowers);
    const lastavatar = JSON.parse(localStorage.getItem('avatar' + props.id)) || "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
    const [avatar, setavatar] = useState(lastavatar);
    const lastsearching = localStorage.getItem('searching' + props.id) || "";
    const [searching, setsearching] = useState(lastsearching);
    let lastuser;
    if (localStorage.getItem('showUser' + props.id) === "undefined")
        lastuser = "";
    else
        lastuser = JSON.parse(localStorage.getItem('showUser' + props.id));
    const [showUser, setShowUser] = useState(lastuser);
    const [open, setOpen] = React.useState(false);

    useEffect(()=>{
        var handle=setInterval(getUserInfo, 10000);

        return ()=>{
            clearInterval(handle);
        }
    });

    useEffect(() => {
        localStorage.setItem("searching" + props.id, searching);
        localStorage.setItem("showUser" + props.id, JSON.stringify(showUser));
        localStorage.setItem("followers" + props.id, followers);
        localStorage.setItem("avatar" + props.id, JSON.stringify(avatar));
    }, [showUser, searching, followers, avatar, props.id]);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function getUserInfo() {
        axios.post('http://localhost:8080/api/github/user', {
            email: Email,
            search: searching,
        }).then(function (response) {
            if (response.data.callback === "success") {
                setShowUser(response.data.user.name);
                setfollowers(response.data.user.followers);
                setavatar(response.data.user.avatar_url);
            } else {
                handleClick();
            }
            console.log(response);
        });
    }

    return (
        <div className="Githubwidget" >
            <div className="align">
                <Avatar
                    src={avatar}
                    style={{height: '80px', width: '80px', left: "138px", top: '10px'}}
                />
                <h1 style={{marginTop: 20}}>{showUser}</h1>
                <TextField
                    variant="outlined"
                    style={{marginTop: '20px'}}
                    label="User"
                    type="text"
                    autoComplete="off"
                    value={searching}
                    onChange={(e) => setsearching(e.target.value)}
                    inputProps={{ style: { fontFamily: 'Roboto', color: 'white' } }}
                />
                <br />
                <h1 style={{marginTop: 20}}>{followers} Followers</h1>
                <Button style={{marginTop: '20px'}} color="success" variant="outlined" onClick={getUserInfo}>Search</Button>
                <Snackbar style={{left: "20px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Please link your account / Unknown user
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}