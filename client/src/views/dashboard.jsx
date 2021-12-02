import React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';

import Grid from './../components/grid';

import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  function disconnectHandling() {
    dispatch({type: 'USER_LOGIN', email: ""});
    navigate('/');
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => navigate('/settings')}
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{textAlign: 'center'}} >
        <Grid />
        <Button variant="outlined" style={{marginTop: 20}} color="error" onClick={disconnectHandling}>Disconnect</Button>
      </div>
    </div>
  );
}

export default Dashboard;