import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Paper,Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import LayoutAdmin from '../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../MyContext';
import { useNavigate } from 'react-router-dom';

function Registration() {
    document.title = "Registration";
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [email, setEmail] = useState('')
    const [roles, setRoles] = useState('SALES')
    const [password, setPassword] = useState('')
    const options = ['ADMIN', 'SALES'];
    const [isSaving, setIsSaving] = useState(false)
    const annuler = () => {
        navigate(`/sales`, { replace: true });
    }

    const handleSave = () => {
        e.preventDefault();
        if (name.trim() === '' || name.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The name cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        let formData = new FormData()
        formData.append("name", name)
        formData.append("contact", contact)
        formData.append("email", email)
        formData.append("roles", roles)
        formData.append("password", password)
        axios.post(`/api/adduser`, formData)
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/userlist`, { replace: true });
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire({
                        icon: 'error',
                        title: 'This user already exist! Please find another username!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'There is an error while creating the user!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'There is an error with the server!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            setIsSaving(false)
        });
    }
    return (
        <LayoutAdmin>
             <Container maxWidth="sm">
                <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 ,width: '500px',mr : 'auto', ml : 'auto'}} >
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Add a new user
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField 
                                    id="name" 
                                    label="Name" 
                                    variant="outlined" 
                                    name="name" 
                                    required
                                    onChange={(event)=>{setName(event.target.value)}}
                                    value={name}  
                                    fullWidth 
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    id="password" 
                                    label="Password" 
                                    variant="outlined" 
                                    name="password"
                                    type="password"
                                    required
                                    onChange={(event)=>{setPassword(event.target.value)}}
                                    value={password}  
                                    fullWidth 
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField 
                                    id="contact" 
                                    label="Phone number" 
                                    variant="outlined" 
                                    name="contact" 
                                    onChange={(event)=>{setContact(event.target.value)}}
                                    value={contact} 
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    id="email" 
                                    label="Email" 
                                    variant="outlined" 
                                    name="email" 
                                    onChange={(event)=>{setEmail(event.target.value)}}
                                    value={email} 
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={options} 
                                    variant="outlined" 
                                    onChange={(event, newValue)=>{setRoles(newValue)}}
                                    value={roles} 
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            id="roles"
                                            label="Roles"
                                            name="roles"
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!roles}
                                            helperText={!roles ? 'roles cannot be empty' : ''}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button 
                                    disabled={
                                        isSaving
                                        || name === '' || name === null
                                        || password === '' || password === null
                                        || roles === '' || roles === null
                                    }
                                    onClick={handleSave} 
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
export default Registration;