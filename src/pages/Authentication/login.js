import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Box,Checkbox, FormControlLabel } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';
// import background from '../../images/Wallpaper-BG-generic.svg';

function Login({ setToken,message }) {
  const LOGIN_URL = '/api/login_check';
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [erreurlogin, setErreurlogin] = useState(false);
  const [erreurmotdepasse, setErreurmotdepasse] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreurlogin(false);
    setErreurmotdepasse(false);
    if (username.trim() === '' || username.trim() === null) {
      Swal.fire({
        icon: 'error',
        title: 'There is an error! Please try again later.',
        showConfirmButton: true
      })
      return;
    }
    if (password.trim() === '' || password.trim() === null) {
      setErreurmotdepasse(true);
      return;
    }
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      const token = response?.data?.token;
      setToken(token);
      window.location.reload();
    } catch (error) {
      if (!error?.response) {
        setError('No Server response');
        Swal.fire({
          icon: 'error',
          title: 'There is an error! Please try again later.',
          showConfirmButton: true
        })
      } else if (error.response?.status === 401) {
        setError('Missing Username or Password');
        Swal.fire({
          icon: 'error',
          title: 'The credentials are not correct! Please try again',
          showConfirmButton: true
        })
      }
      else {
        setError('Login failed');
        Swal.fire({
          icon: 'error',
          title: 'Authentification echoué! Veuillez contacter l\'administrateur',
          showConfirmButton: true
        })
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
        // backgroundImage : `url(${background})`
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3
       
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Connexion
        </Typography>

        <TextField
          label="Username"
          error={erreurlogin}
          variant="outlined"
          fullWidth
          value={username}
          onChange={e => setUserName(e.target.value)}
          helperText={erreurlogin ? 'The username cannot be empty!' : ''}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
          helperText={erreurmotdepasse ? 'The password cannot be empty' : ''}
          sx={{ marginBottom: 2 }}
        />
          {message && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default Login;

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}