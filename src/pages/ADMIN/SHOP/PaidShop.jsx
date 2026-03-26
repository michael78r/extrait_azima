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
import {Paper,Typography} from '@mui/material';

function PaidShop() {
    document.title = "Update a payment";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [shopname, setShopName] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    const [cash,setCash] = useState('');
    useEffect(() => {
        axios.get(`/api/shop/${id}`)
        .then(function (response) {
            let shop = response.data
            setShopName(shop.shopname);
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
        navigate(`/shops`, { replace: true });
    }

    const handleSave = () => {
        setIsSaving(true);
        let formData = new FormData()
        formData.append("id", id)
        formData.append("cash", cash)

        axios.post(`/api/paidshop`, formData)
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/shops`, { replace: true });
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
                        Paid shop
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField id="shopname" label="Shop name" variant="outlined" name="shopname" 
                                        onChange={(event)=>{setShopName(event.target.value)}}
                                        value={shopname}  fullWidth disabled/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="cash" label="Cash" variant="outlined" name="cash" 
                                        onChange={(event)=>{setCash(event.target.value)}}
                                        value={cash} fullWidth/>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button 
                        disabled={isSaving || cash=='' ||cash==null || parseInt(cash)==0}
                        onClick={handleSave} 
                        type="button"
                        variant="contained"
                        color="success"
                        sx={{ mr: 2, minWidth: '120px' }}
                        >
                        {isSaving ? 'Saving...' : 'Paid'}
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
export default PaidShop;