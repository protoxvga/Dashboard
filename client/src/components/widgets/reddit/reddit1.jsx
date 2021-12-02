import React, { useState, useEffect } from 'react';

import "./../../style/reddit1.css";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'

import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Reddit1(props) {
    const Email = useSelector((state) => state.email);
    const [search, setsearch] = useState("")
    const [error_text, set_error_text] = useState("");
    const [open, setOpen] = React.useState(false);
    const lastsubredditname = JSON.parse(localStorage.getItem('subreddit' + props.id)) || "Last Subbreddit posts";
    const [subreddit, setsubreddit] = useState(lastsubredditname);
    let lastavatar;
    if (localStorage.getItem('avatar' + props.id) === "undefined")
        lastavatar = "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1";
    else
        lastavatar = JSON.parse(localStorage.getItem('avatar' + props.id))
    const [avatar, setavatar] = useState(lastavatar);
    const lasttitle = JSON.parse(localStorage.getItem('title' + props.id)) || "";
    const [title, settitle] = useState(lasttitle);
    const lasturl = JSON.parse(localStorage.getItem('url' + props.id)) || "";
    const [url, seturl] = useState(lasturl);
    const lastusername = JSON.parse(localStorage.getItem('username' + props.id)) || "";
    const [username, setusername] = useState(lastusername);
    const lasttext = JSON.parse(localStorage.getItem('text' + props.id)) || "";
    const [text, settext] = useState(lasttext);

    useEffect(() => {
        localStorage.setItem("subreddit" + props.id, JSON.stringify(subreddit));
        localStorage.setItem("avatar" + props.id, JSON.stringify(avatar));
        localStorage.setItem("title" + props.id, JSON.stringify(title));
        localStorage.setItem("url" + props.id, JSON.stringify(url));
        localStorage.setItem("username" + props.id, JSON.stringify(username));
        localStorage.setItem("text" + props.id, JSON.stringify(text));
    }, [subreddit, avatar, title, url, text, username, props.id]);

    const handleClick = (text) => {
        set_error_text(text);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function getUserInfo() {
        axios.post('http://localhost:8080/api/reddit/subbreddit', {
            email: Email,
            search: search,
        }).then(function (response) {
            if (response.data.length <= 1) {
                handleClick("Subreddit not found");
            } else if (response.data.callback === "error") {
                handleClick("Please link your account");
            } else if (response.data[0].callback === "success") {
                setsubreddit(response.data[0].subreddit_name);
                setavatar(response.data[0].avatar);
                settitle(response.data[0].title);
                seturl(response.data[0].url);
                setusername(response.data[0].user_name);
                settext(response.data[0].text);
            }
        });
    }

    return (
        <div className="widget" >
            <div className="align">
                <Avatar
                    src={avatar}
                    style={{height: '80px', width: '80px', left: "138px", top: '10px'}}
                />
                <h1 style={{marginTop: 20}}>{subreddit}</h1>
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
                <Button style={{marginTop: '20px'}} variant="outlined" onClick={getUserInfo}>Search</Button>
                <h1 style={{marginTop: '20px'}}>{title} <br /> u/{username}</h1>
                {(text === "")
                    ? <></>
                    : <p style={{marginTop: '20px', color: "#fff"}}>{text.substring(0, 400) + "..."}</p>
                }
                {(url.slice(url.length - 3, url.length) === 'png' || url.slice(url.length - 3, url.length) === 'gif' || url.slice(url.length - 3, url.length) === 'jpg')
                    ? <img src={url} style={{marginTop: '20px'}} width="300px" />
                    : (url.search('youtube') >= 0 || url.search('youtu.be') >= 0)
                    ? <ReactPlayer url={url} width='300px' />
                    : (url === "")
                    ? <></>
                    : <a href={url} style={{color: "#fff", marginTop: '40px'}}>{url.substring(0, 50) + "..."}</a>
                }
                <Snackbar style={{left: "80px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {error_text}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}