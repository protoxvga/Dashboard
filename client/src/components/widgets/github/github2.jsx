import React, { useState, useEffect } from 'react';

import "./../../style/github.css";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useSelector } from 'react-redux'

import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Github2(props) {
    const Email = useSelector((state) => state.email);
    const lastdate = localStorage.getItem('date' + props.id) || '';
    const [date, setdate] = useState(lastdate);
    const lasttitle = localStorage.getItem('title' + props.id) || "";
    const [title, settitle] = useState(lasttitle);
    const lastauthor = localStorage.getItem('author' + props.id) || "";
    const [author, setauthor] = useState(lastauthor);
    const lastrepository = localStorage.getItem('repository' + props.id) || "";
    const [repository, setrepository] = useState(lastrepository);
    const [open, setOpen] = React.useState(false);

    useEffect(()=>{
        var handle=setInterval(getUserInfo, 10000);

        return ()=>{
            clearInterval(handle);
        }
    });

    useEffect(() => {
        localStorage.setItem("author" + props.id, author);
        localStorage.setItem("title" + props.id, title);
        localStorage.setItem("repository" + props.id, repository);
        localStorage.setItem("date" + props.id, date);
    }, [author, repository, date, title, props.id]);

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
        axios.post('http://localhost:8080/api/github/repo', {
            email: Email,
            repo: repository,
        }).then(function (response) {
            if (response.data.callback === "success") {
                setauthor(response.data.author);
                settitle(response.data.message);
                setdate(response.data.date);
            } else {
                handleClick();
            }
            console.log(response);
        });
    }

    return (
        <div className="Githubwidget" >
            <div className="align">
                <TextField
                    variant="outlined"
                    style={{marginTop: '10px'}}
                    label="Repository"
                    type="text"
                    autoComplete="off"
                    value={repository}
                    onChange={(e) => setrepository(e.target.value)}
                    inputProps={{ style: { fontFamily: 'Roboto', color: 'white' } }}
                />
                <br />
                <h1 style={{marginTop: 20}}>{author}</h1>
                <h1 style={{marginTop: 20}}>{date}</h1>
                <p style={{marginTop: 20, fontSize: 16}}>{title}</p>
                <Button style={{marginTop: '20px'}} color="success" variant="outlined" onClick={getUserInfo}>Search</Button>
                <Snackbar style={{left: "20px"}} open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        Please link your account / Unknown repo
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}