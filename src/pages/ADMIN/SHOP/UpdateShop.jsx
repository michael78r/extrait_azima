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
import Autocomplete  from '@mui/material/Autocomplete';

function UpdateShop() {
    document.title = "Update a shop";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id);
    const [section, setSection] = useState('');
    const [location, setLocation] = useState('');
    const [shopname, setShopName] = useState('');
    const [nameManagerShop, setNameManagerShop] = useState('');
    const [phone, setPhone] = useState('');
    const [credit, setCredit] = useState('');
    const [creditDays, setCreditDays] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);

    const [cities,setCities] = useState([]);
    const [selectedCity,setSelectedCity] = useState();



    useEffect(() => {
        Promise.all([
            axios.get(`/api/cities`),
            axios.get(`/api/shop/${id}`)
        ])
        .then(([cityData, shopData]) => {
            let shop = shopData.data
            setSection(shop.section);
            setLocation(shop.location);
            setShopName(shop.shopname);
            setPhone(shop.phone);
            setCredit(shop.creditLimit);
            setCreditDays(shop.creditDays);
            setNameManagerShop(shop.nameManagerShop);
            setCities(cityData.data);
            cityData.data.map(city=>{
                if(city.id==shop.cityId){
                    setSelectedCity(city);
                }
            });
         
    
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
        if (shopname.trim() === '' || shopname.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The shopname cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/shop/${id}`, {
            section: section,
            location: location,
            shopname: shopname,
            phone: phone,
            credit: credit,
            creditDays: creditDays,
            nameManagerShop : nameManagerShop,
            // cityId : selectedCity.id,
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
                <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 ,width: '500px' }}>
                        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Modify the shop
                        </Typography>
                        <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
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
                                <TextField id="nameManagerShop" label="Name of manager shop" variant="outlined" name="nameManagerShop" 
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
export default UpdateShop;