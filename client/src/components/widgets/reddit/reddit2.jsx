import React, { useState, useEffect } from 'react';

import "./../../style/reddit2.css";

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
    let lastsubredditname;
    if (localStorage.getItem('subreddit' + props.id) === "undefined")
        lastsubredditname = "Subscriber counter";
    else
        lastsubredditname = JSON.parse(localStorage.getItem('subreddit' + props.id))
    const [subreddit, setsubreddit] = useState(lastsubredditname);
    const lastsearch = JSON.parse(localStorage.getItem('search' + props.id)) || "";
    const [search, setsearch] = useState(lastsearch);
    const lastsubscribers = JSON.parse(localStorage.getItem('subscribers' + props.id)) || "0";
    const [subscribers, setsubscribers] = useState(lastsubscribers);
    const [open, setOpen] = React.useState(false);
    let lastavatar;
    if (localStorage.getItem('avatar' + props.id) === "undefined")
        lastavatar = "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
    else
        lastavatar = JSON.parse(localStorage.getItem('avatar' + props.id))
    const [avatar, setavatar] = useState(lastavatar);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(()=>{
        var handle=setInterval(getUserInfo, 20000);    

        return ()=>{
            clearInterval(handle);
        }
    });

    useEffect(() => {
        localStorage.setItem("search" + props.id, JSON.stringify(search));
        localStorage.setItem("subreddit" + props.id, JSON.stringify(subreddit));
        localStorage.setItem("avatar" + props.id, JSON.stringify(avatar));
        localStorage.setItem("subscribers" + props.id, JSON.stringify(subscribers));
    }, [subreddit, search, avatar, subscribers, props.id]);

    function getUserInfo() {
        axios.post('http://localhost:8080/api/reddit/subscribers', {
            email: Email,
            search: search,
        }).then(function (response) {
            if (response.data.length <= 0) {
                handleClick("Subreddit not found");
            } else if (response.data.callback === "error") {
                handleClick("Please link your account");
            } else if (response.data[0].callback === "success") {
                setsubreddit(response.data[0].subreddit_name);
                setavatar(response.data[0].avatar);
                setsubscribers(response.data[0].subscribers);
            }
        });
    }

    return (
        <div className="widgetReddit2" >
            <div className="align">
                <h1>{subreddit}</h1>
                <Avatar
                    src={avatar}
                    style={{height: '80px', width: '80px', left: "138px", top: '10px'}}
                />
                <TextField
                    variant="outlined"
                    style={{marginTop: '20px'}}
                    label="Subreddit"
                    type="text"
                    autoComplete="off"
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    inputProps={{ style: { fontFamily: 'Roboto', color: 'white' } }}
                />
                <br />
                <h1 style={{marginTop: '20px'}}>{Intl.NumberFormat().format(subscribers)} Subscriber(s)</h1>
                <Button style={{marginTop: '20px'}} variant="outlined" onClick={getUserInfo}>Search</Button>
                <Snackbar style={{left: "10px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Please link your account / Unknown subreddit
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}