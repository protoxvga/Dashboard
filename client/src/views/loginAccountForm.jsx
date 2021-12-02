import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import GoogleButton from 'react-google-button'

import InputAdornment from '@mui/material/InputAdornment';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import { useDispatch } from 'react-redux'

import gradient from 'random-gradient'

import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import './style/form.css';

const bgGradient = {background: gradient((Math.random() + 1).toString(36).substring(7), 'diagonal')}

const LoginAccountForm = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [EmailButtonState, setEmailButtonState] = useState(false);
  const [EmailHelperText, setEmailHelperText] = useState('');
  const [PasswordButtonState, setPasswordButtonState] = useState(false);
  const [PasswordHelperText, setPasswordHelperText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function LoginWithGoogle() {
    const url = 'http://localhost:8080/auth/google';
    window.open(url);
  }

  function LoginUser() {
    axios.post('http://localhost:8080/api/user-login', {
      email: Email,
      password: Password
    })
    .then(function (response) {
      if (response.data.email === 'ko' && response.data.password === 'ko') {
        setEmailButtonState(true);
        setPasswordButtonState(true);
        setEmailHelperText('Please enter a valid email');
        setPasswordHelperText('Please enter a valid password');
      }
      if (response.data.email === 'ok' && response.data.password === 'ko') {
        setEmailButtonState(false);
        setPasswordButtonState(true);
        setEmailHelperText('');
        setPasswordHelperText('Please enter a valid password');
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
      }
      if (response.data.email === 'exist' && response.data.password === 'exist') {
        dispatch({type: 'USER_LOGIN', email: Email});
        navigate('/dashboard');
      }
      else if (response.data.email === 'no exist' && response.data.password === 'no exist')
        alert("Le compte n'existe pas");
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  return (
    <div className="LogContainer" style={bgGradient}>
      <div className="form">
        <Box sx={{textAlign: 'center'}}>
          <h1 style={{fontFamily: 'Roboto', color: '#2d3436'}}>Login</h1>
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
            style={{marginTop: 40, width: 300}}
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
          <div style={{display: 'row', marginTop: 20}}>
            <Button style={{color: '#2d3436'}} variant="outlined" onClick={() => {LoginUser()}}>Login</Button>
            <GoogleButton style={{marginLeft: 50, marginTop: 20, color: '#2d3436'}} variant="outlined" onClick={() => {LoginWithGoogle()}}>Login With Google</GoogleButton>
          </div>
          <p style={{color: '#2d3436', fontSize: 18,marginTop: 20, fontFamily: 'Roboto'}}>Don't have an account yet ?<Link style={{marginLeft: 10, textDecoration: 'none'}} to="/register">Register</Link></p>
        </Box>
      </div>
    </div>
  );
}

export default LoginAccountForm;