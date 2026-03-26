import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import LayoutAdmin from '../../LayoutAdmin';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import MyContext from '../../MyContext';

const DetailUser = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(null);
  const {username1,setUsername1} = useContext(MyContext);


  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/user/${username1}`)
      .then(function (response) {
        let user = response.data;
        setUser(user);
        setLoading(false);
      })
      .catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'An Error Occurred!',
          showConfirmButton: false,
          timer: 1500
        });
        setLoading(false);
      });
  }, [username1]);
  const handleOpenUsernameDialog = () => {
    setOpenUsernameDialog(true);
  };
  const handleCloseUsernameDialog = () => {
    setOpenUsernameDialog(false);
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleSaveUsername = () => {
    axios.patch(`/api/user/editusername/${username1}`, { username: newUsername })
      .then(response => {
        Swal.fire('Success', 'Username updated!', 'success');
        setUser({ ...user, username: newUsername });
        setUsername1(newUsername);
        handleCloseUsernameDialog();
      })
      .catch(error => {
        console.log(error);
        handleCloseUsernameDialog();
        Swal.fire('Error', "Failed to update username", 'error');
      });
  };

  const handleSavePassword = () => {
    axios.patch(`/api/user/editpassword/${username1}`, { oldPassword: oldPassword, newPassword : newPassword})
    .then(response => {
        Swal.fire('Success', 'Password updated!', 'success');
       cc
    })
    .catch(error => {
      handleClosePasswordDialog();
        if (error.response) {
            if (error.response.status === 403) {
                Swal.fire('Error', 'the old password you entered is incorrect', 'error');
            } else {
                Swal.fire('Error', 'Failed to update password', 'error');
            }
        } else {
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
        }
    });
  };

  return (
    <LayoutAdmin>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        user && (
          <>
            <Card
 style={{ maxWidth: 500, margin: 'auto', padding: '20px 5px' }}>

  <CardContent>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          {user.username}
          <IconButton
            onClick={handleOpenUsernameDialog}
            style={{ color: '#1976d2', marginLeft: '10px' }} // Bouton avec une couleur et de l'espace
          >
            <EditIcon />
          </IconButton>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '10px' }}>
          <strong>Role:</strong> {user.roles}
        </Typography>
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '10px' }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '10px' }}>
          <strong>Contact:</strong> {user.Contact}
        </Typography>

        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '10px' }}>
          <strong>Password:</strong> ****** 
          <IconButton
            onClick={handleOpenPasswordDialog}
            style={{ color: '#1976d2', marginLeft: '10px' }} // Bouton avec une couleur et de l'espace
          >
            <EditIcon />
          </IconButton>
        </Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>

            <Dialog open={openUsernameDialog} onClose={handleCloseUsernameDialog}>
              <DialogTitle>Edit Username</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter the new username.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="New Username"
                  fullWidth
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseUsernameDialog}>Cancel</Button>
                <Button onClick={handleSaveUsername} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
              <DialogTitle>Edit Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter your old password and new password.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Old Password"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePasswordDialog}>Cancel</Button>
                <Button onClick={handleSavePassword} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )
      )}
    </LayoutAdmin>
  );
};

export default DetailUser;
