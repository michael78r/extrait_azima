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
import {Paper,Typography,Checkbox, FormControlLabel } from '@mui/material';

function UpdateSales() {
    document.title = "Update a salesman";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [canSellCash, setCanSellCash] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/sales/${id}`)
        .then(function (response) {
            let sales = response.data
            setName(sales.name);
            setContact(sales.contact);
            setAddress(sales.address);
            setCanSellCash(sales.canSellCash);
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
        navigate(`/sales`, { replace: true });
    }

    const handleSave = () => {
        if (name.trim() === '' || name.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The name cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/sales/${id}`, {
            name: name,
            contact: contact,
            address: address,
            canSellCash : canSellCash,
            utilisateur: username1
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/sales`, { replace: true });
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
                    Modify the salesman
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField id="name" label="Name" variant="outlined" name="name" 
                                        onChange={(event)=>{setName(event.target.value)}}
                                        value={name} fullWidth/>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField id="contact" label="Phone number" variant="outlined" name="contact" 
                                        onChange={(event)=>{setContact(event.target.value)}}
                                        value={contact} fullWidth/>
                            </Grid>
                            <Grid item xs={12} >
                                <TextField id="address" label="Address" variant="outlined" name="address" 
                                        onChange={(event)=>{setAddress(event.target.value)}}
                                        value={address} fullWidth/>
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
export default UpdateSales;