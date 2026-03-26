import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';
import {Paper,Typography,Autocomplete} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function AddShop() {
    document.title = "Add a shop";
    const navigate = useNavigate();
    const [section, setSection] = useState('');
    const [location, setLocation] = useState('');
    const [shopname, setShopName] = useState('');
    const [phone, setPhone] = useState('');
    const [nameManagerShop, setNameManagerShop] = useState('');
    const [credit, setCredit] = useState(0);
    const [creditDays, setCreditDays] = useState(0)
    const [isSaving, setIsSaving] = useState(false);

    const [cities,setCities] = useState([]);
    const [selectedCity,setSelectedCity] = useState();
    const [salesman,setSalesman] = useState([]);
    const [selectedSalesman,setSelectedSalesman] = useState();


    const [loading, setLoading] = useState(false);

    const username1 = useContext(MyContext);
    const annuler = () => {
        navigate(`/shops`, { replace: true });
    }

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get(`/api/cities`),
            axios.get(`/api/sales`),
        ])
        .then(([cityData, salesData]) => {
            console.log(cityData);
            console.log(salesData);
            setCities(cityData.data);
            setSalesman(salesData.data);
        
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

    const handleSave = () => {
        if (shopname.trim() === '' || shopname.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The shopname cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        const formData = {
            cityId: selectedCity.id,
            salesmanId: selectedSalesman.id,
            section: section,
            location: location,
            shopname: shopname,
            phone: phone,
            credit : credit,
            creditDays : creditDays,
            utilisateur: username1,
            nameManagerShop: nameManagerShop,
    };
        
        axios.post(`/api/addshop`,formData)
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
                title: error,
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
                        Add a shop
                        </Typography>
                        <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={cities}
                                    getOptionLabel={(option) => option.cityname} 
                                    onChange={(event, newValue) => {
                                        setSelectedCity(newValue); 
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select a city" variant="outlined" />
                                    )}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={salesman}
                                    getOptionLabel={(option) => option.name} 
                                    onChange={(event, newValue) => {
                                        setSelectedSalesman(newValue); 
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select a salesman" variant="outlined" />
                                    )}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="section" label="Section" variant="outlined" name="section" 
                                            onChange={(event)=>{setSection(event.target.value)}}
                                            value={section} fullWidth />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField id="location" label="Location" variant="outlined" name="location" 
                                        onChange={(event)=>{setLocation(event.target.value)}}
                                        value={location} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="shopname" label="Shop name" variant="outlined" name="shopname" 
                                        onChange={(event)=>{setShopName(event.target.value)}}
                                        value={shopname} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="nameManagerShop" label="Name of manager shop " variant="outlined" name="nameManagerShop" 
                                        onChange={(event)=>{setNameManagerShop(event.target.value)}}
                                        value={nameManagerShop} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="phone" label="Phone number" variant="outlined" name="phone" 
                                        onChange={(event)=>{setPhone(event.target.value)}}
                                        value={phone} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="credit" label="Credit limit" variant="outlined" name="credit" 
                                        onChange={(event)=>{setCredit(event.target.value)}}
                                        value={credit} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="creditDays" label="Credit days" variant="outlined" name="creditDays" 
                                        onChange={(event)=>{setCreditDays(event.target.value)}}
                                        value={creditDays} fullWidth/>
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
                )}
            </Container>
        </LayoutAdmin>
    );
}
export default AddShop;