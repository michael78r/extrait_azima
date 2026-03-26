import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';
import {Paper,Typography,Checkbox, Autocomplete } from '@mui/material';

function UpdateUser() {
    document.title = "Update user";
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [username, setUserName] = useState(useParams().username);
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRole,setSelectedRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const roles = ["ADMIN", "SALES", "ADMIN,SALES","CASHVAN"];
    const username1 = useContext(MyContext);
    useEffect(() => {
        console.log(username);
        axios.get(`/api/user/${username}`)
        .then(response=> {
            setId(response.data.id);
            setUserName(response.data.username);
            setContact(response.data.Contact);
            setSelectedRole(response.data.roles[0]);
            setEmail(response.data.email);
            setLoading(false);
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false);
        })
    }, []);

    const annuler = () => {
        navigate(`/listuser`, { replace: true });
    }
    const handleRoleChange = (event, value) => {
        if (value === "ADMIN,SALES") {
            setSelectedRole(["ADMIN", "SALES"]);
        } else {
            setSelectedRole(value);
        }
    };
    const handleSave = () => {
        if (username.trim() === '' || username.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The name cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/edit/user/${id}`, {
            username: username,
            contact: contact,
            email: email,
            role : selectedRole
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/listuser`, { replace: true });
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'There is at least one error with your data!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false)
        });
    }
    return (
        <LayoutAdmin>
          <Container 
            maxWidth="sm" 
            >
            {loading ? (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open="true"
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 ,width: '500px'}}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    Modify the role
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            {/* <Grid item xs={12}>
                                <TextField id="username" label="username" variant="outlined" name="username" 
                                        onChange={(event)=>{setUserName(event.target.value)}}
                                        value={username} fullWidth/>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField id="contact" label="Phone number" variant="outlined" name="contact" 
                                        onChange={(event)=>{setContact(event.target.value)}}
                                        value={contact} fullWidth/>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField id="address" label="Address" variant="outlined" name="address" 
                                        onChange={(event)=>{setEmail(event.target.value)}}
                                        value={email} fullWidth/>
                            </Grid> */}
                            <Grid item xs={12}>
                            <Autocomplete
                                        options={roles}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                        renderInput={(params) => <TextField {...params} label="Select role" />}
                                        sx={{ mb: 3 }}
                                        />

                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button 
                            disabled={isSaving}
                            onClick={handleSave} 
                            type="button"
                            variant="contained"
                            color="success"
                            sx={{ mr: 2, minWidth: '120px' }}
                            >
                            {isSaving ? 'Saving...' : 'Update'}
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
            )}
            </Container>
        </LayoutAdmin>
    );
}
export default UpdateUser;