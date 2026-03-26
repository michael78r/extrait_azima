import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
}
from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';

function Essai({ setToken }) {
  const LOGIN_URL = '/api/login_check';
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || username.trim() === null) {
      Swal.fire({
          icon: 'warning',
          title: 'Le nom d\'utilisateur ne peut pas être vide!',
          showConfirmButton: true,
      })
      return;
    }
    if (password.trim() === '' || password.trim() === null) {
      Swal.fire({
          icon: 'warning',
          title: 'Le mot de passe ne peut pas être vide!',
          showConfirmButton: true,
      })
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
          title: 'Il y a un erreur de serveur! Veuillez contacter l\'administrateur',
          showConfirmButton: true
        })
      } else if (error.response?.status === 401) {
        setError('Missing Username or Password');
        Swal.fire({
          icon: 'error',
          title: 'Le nom d\'utilisateur et le mot de passe ne se correspondent pas! Veuillez reessayer!',
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
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <div className="text-center">
        <h4 className="mt-1 mb-5 pb-1">EASYLINK</h4>
      </div>
      <p>Please login to your account</p>
      <form onSubmit={handleSubmit}>
      <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' onChange={e => setUserName(e.target.value)}/>
      <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' onChange={e => setPassword(e.target.value)}/>

      <MDBBtn className="mb-4" type="submit">Sign in</MDBBtn>
      </form>

    </MDBContainer>
  );
}

export default Essai;

Essai.propTypes = {
    setToken: PropTypes.func.isRequired
}