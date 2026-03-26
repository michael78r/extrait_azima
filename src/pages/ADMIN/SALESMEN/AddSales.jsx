import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import {Paper,Typography ,Checkbox, FormControlLabel} from '@mui/material';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';

function AddSales() {
    document.title = "Add a salesman";
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [canSellCash, setCanSellCash] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const username1 = useContext(MyContext);
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
        let formData = new FormData()
        formData.append("name", name)
        formData.append("contact", contact)
        formData.append("address", address)
        formData.append("canSellCash", canSellCash)
        formData.append("utilisateur", username1)
        axios.post(`/api/addsales`,formData)
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
             <Container maxWidth="sm">
                <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 ,width: '500px',mr : 'auto', ml : 'auto'}} >
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Add a salesman
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
export default AddSales;