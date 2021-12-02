import React from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useParams
} from "react-router-dom";

import CreateAccountForm from './views/createAccountForm';
import LoginAccountForm from './views/loginAccountForm';
import Dashboard from './views/dashboard';
import Settings from './views/settings';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux'

function GoogleRedirectAccountForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {email} = useParams();

  async function redirect() {
    await dispatch({type: 'USER_LOGIN', email: ''});
    await dispatch({type: 'USER_LOGIN', email: email});
    navigate('/dashboard');
  }

  return (
    <div>
      <h1>{email}</h1>
      <h1>test</h1>
      <Button onPress={redirect()}></Button>
    </div>
  );
}

export default function App() {
  const email = useSelector((state) => state.email);

  const outerTheme = createTheme({
    palette: {
      primary: {
        main: '#2d3436',
      },
      input: {
        color: "white",
      }
    },
  });

  return (
    <ThemeProvider theme={outerTheme}>
      <Routes>
        <Route exact path="/" element={<LoginAccountForm />} />
        <Route exact path="/register" element={<CreateAccountForm />} />
        <Route exact path="/dashboard" element={
          (email === "")
          ? <LoginAccountForm />
          : <Dashboard />
        } />
        <Route exact path="/settings" element={
          (email === "")
          ? <LoginAccountForm />
          : <Settings />
        } />
        <Route path="/dashboard/google/redirect/:email" element={<GoogleRedirectAccountForm />}/>
      </Routes>
    </ThemeProvider>
  );
}