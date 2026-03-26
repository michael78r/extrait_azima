import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, CircularProgress ,Autocomplete,Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Container, Grid, FormControlLabel, Checkbox } from '@mui/material';
import LayoutAdmin from '../../LayoutAdmin'; // Assurez-vous que le chemin est correct


function AddUserSalesMan() {
    document.title = "Add user";
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [selectedRole,setSelectedRole] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [canSellCash, setCanSellCash] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const roles = ["ADMIN","SALES","CASHVAN"];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (!validateEmail(event.target.value)) {
            setError("Please enter a valid email");
        } else {
            setError(null); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        if (name.trim() === '') {
            setError('Username  are required');
            return;
        }
         if ( selectedRole.trim()=='') {
            setError('role  are required');
            return;
        }

        setIsSaving(true);
        let formData = new FormData();
        formData.append("username", name);
        formData.append("password", password);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("roles", selectedRole);
        formData.append("name", name)
        formData.append("address", address)
        formData.append("canSellCash", canSellCash)

        try {
            const response = await axios.post(`/api/adduser`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            });
            setIsSaving(false);
            navigate(`/listuser`, { replace: true });
        } catch (error) {
            setIsSaving(false);
            if (error.response && error.response.status === 409) {
                // Error 409: Username is already taken
                setError('The username is already in use. Please choose another one.');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'There was an error processing your request!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    const annuler = () => {
        navigate(-1, { replace: true });
    }

    return (
        <LayoutAdmin>
        <Container maxWidth="sm">
           <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 ,width: '500px',mr : 'auto', ml : 'auto'}} >
               <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                   Add new user
               </Typography>
               <Box component="form" sx={{ mt: 3 }}>
                   <Grid container spacing={3}>
                       <Grid item xs={12}>
                       <TextField id="name" label="Name" variant="outlined" name="name" 
                               onChange={(event)=>{setName(event.target.value)}}
                               value={name}  fullWidth />
                       </Grid>
                       <Grid item xs={12} >
                           <TextField id="contact" label="Phone number" variant="outlined" name="contact" 
                                   onChange={(event)=>{setContact(event.target.value)}}
                                   value={contact} fullWidth />
                       </Grid>
                       <Grid item xs={12}>
                           <TextField id="address" label="Address" variant="outlined" name="address" 
                                   onChange={(event)=>{setAddress(event.target.value)}}
                                   value={address} fullWidth/>
                       </Grid>
                       <Grid item xs={12}>
                            <TextField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    fullWidth
                                    variant="outlined"
                                />
                       </Grid>
                       <Grid item xs={12}>
                       <TextField id="username" label="Username" variant="outlined" name="username" 
                              disabled={true}
                               value={name}  fullWidth />
                       </Grid>
                       <Grid item xs={12}>
                            <TextField
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    fullWidth
                                    variant="outlined"
                            />
                       </Grid>
                       <Grid item xs={12}>
                            <Autocomplete
                                    options={roles}
                                    value={selectedRole}
                                    onChange={(event, value) => setSelectedRole(value)}
                                    renderInput={(params) => <TextField {...params} label="Select role" />}
                                    sx={{ mb: 3 }}
                                />
                       </Grid>
                       <Grid item xs={12}>
                           <FormControlLabel
                               control={
                                   <Checkbox
                                       checked={canSellCash}
                                       onChange={(event)=>{setCanSellCash(event.target.checked)}}
                                       color="primary"
                                   />
                               }
                               label="Allow cash sales"
                           />
                       </Grid>
                       {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                   </Grid>
                       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                       <Button 
                       disabled={isSaving}
                       onClick={handleSubmit} 
                       type="button"
                       variant="contained"
                       color="success"
                       sx={{ mr: 2, minWidth: '120px' }}
                       >
                       {isSaving ? 'Saving...' : 'Add'}
                       </Button>
                       <Button 
                       onClick={annuler} 
                       type="button"
                       variant="outlined"
                       color="error"
                       sx={{ minWidth: '120px' }}
                       >
                       Cancel
                       </Button>
                   </Box>
               </Box>
           </Paper>
       </Container>
   </LayoutAdmin>
    );


}

export default AddUserSalesMan;