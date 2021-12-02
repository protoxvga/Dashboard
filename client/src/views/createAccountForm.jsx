import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import InputAdornment from '@mui/material/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import gradient from 'random-gradient'

import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import './style/form.css';

const bgGradient = { background: gradient((Math.random() + 1).toString(36).substring(7), 'diagonal') }

const CreateAccountForm = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Username, setUsername] = useState('');
  const [EmailButtonState, setEmailButtonState] = useState(false);
  const [EmailHelperText, setEmailHelperText] = useState('');
  const [PasswordButtonState, setPasswordButtonState] = useState(false);
  const [PasswordHelperText, setPasswordHelperText] = useState('');
  const [UsernameButtonState, setUsernameButtonState] = useState(false);
  const [UsernameHelperText, setUsernameHelperText] = useState('');

  const navigate = useNavigate();

  function CreateUser() {
    axios.post('http://localhost:8080/api/user-create', {
      email: Email,
      password: Password,
      username: Username
    })
    .then(function (response) {
      if (response.data.username === 'ko') {
        setUsernameButtonState(true);
        setUsernameHelperText('Please enter a valid username');
      }
      if (response.data.email === 'ko' && response.data.password === 'ko') {
        setEmailButtonState(true);
        setPasswordButtonState(true);
        setEmailHelperText('Please enter a valid email');
        setPasswordHelperText('The password must be 6 characters long');
      }
      if (response.data.email === 'ok' && response.data.password === 'ko') {
        setEmailButtonState(false);
        setPasswordButtonState(true);
        setEmailHelperText('');
        setPasswordHelperText('The password must be 6 characters long');
      }
      if (response.data.email === 'ko' && response.data.password === 'ok') {
        setEmailButtonState(true);
        setPasswordButtonState(false);
        setEmailHelperText('Please enter a valid email');
        setPasswordHelperText('');
      }
      if (response.data.email === 'ok' && response.data.password === 'ok') {
        setEmailButtonState(false);
        setPasswordButtonState(false);
        setEmailHelperText('');
        setPasswordHelperText('');
        navigate('/');
      }
      if (response.data.email === 'exist' && response.data.password === '')
        alert('already exist');
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div class="LogContainer" style={bgGradient}>
      <div class="form">
        <Box sx={{textAlign: 'center'}}>
          <h1 style={{fontFamily: 'Roboto', color: '#2d3436'}}>Create Account</h1>
          <TextField
            required
            variant="standard"
            error={UsernameButtonState}
            helperText={UsernameHelperText}
            id="contained"
            label="Username"
            type="text"
            autoComplete="off"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            style={{marginTop: 40, width: 300}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            variant="standard"
            error={EmailButtonState}
            helperText={EmailHelperText}
            id="contained"
            label="Email"
            type="email"
            autoComplete="off"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            style={{marginTop: 20, width: 300}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            variant="standard"
            error={PasswordButtonState}
            helperText={PasswordHelperText}
            id="contained"
            label="Password"
            type="password"
            autoComplete="off"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            style={{marginTop: 20, width: 300}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button style={{marginTop: 20, marginRight: 10, color: '#2d3436'}} variant="outlined" onClick={() => {CreateUser()}}>Register</Button>
          <p style={{color: '#2d3436', fontSize: 18,marginTop: 20, fontFamily: 'Roboto'}}>Already have an account ?<Link style={{marginLeft: 10, textDecoration: 'none'}} to="/">Login</Link></p>
        </Box>
      </div>
    </div>
  );
}

export default CreateAccountForm;