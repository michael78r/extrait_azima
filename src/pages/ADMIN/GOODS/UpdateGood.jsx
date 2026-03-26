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
import {Paper,Typography,Tabs,Tab} from '@mui/material';

function UpdateGood() {
    document.title = "Update a product";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [brand, setBrand] = useState('');
    const [pricectns, setPricectns] = useState(0);
    const [pricebox, setPricebox] = useState(0);
    const [priceitem, setPriceitem] = useState(0);
    const [pricesac, setPricesac] = useState(0);
    const [pricebottle, setPricebottle] = useState(0);

    const [pricectns_cashvan, setPricectns_cashvan] = useState(0);
    const [pricebox_cashvan, setPricebox_cashvan] = useState(0);
    const [priceitem_cashvan, setPriceitem_cashvan] = useState(0);
    const [pricesac_cashvan, setPricesac_cashvan] = useState(0);
    const [pricebottle_cashvan, setPricebottle_cashvan] = useState(0);

    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const [tabIndex,setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
      };
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/good/${id}`)
        .then(function (response) {
            let good = response.data
            setBrand(good.brand);
            setPricectns(good.pricectns);
            setPricebox(good.pricebox);
            setPriceitem(good.priceitem);
            setPricesac(good.pricesac);
            setPricebottle(good.pricebottle);

            setPricectns_cashvan(good.pricectns_cashvan);
            setPricebox_cashvan(good.pricebox_cashvan);
            setPriceitem_cashvan(good.priceitem_cashvan);
            setPricesac_cashvan(good.pricesac_cashvan);
            setPricebottle_cashvan(good.pricebottle_cashvan);
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
        navigate(`/goods`, { replace: true });
    }

    const handleSave = () => {
        if (brand.trim() === '' || brand.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The brand cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/good/${id}`, {
            brand: brand,
            pricectns: pricectns,
            pricebox: pricebox,
            priceitem: priceitem,
            pricesac: pricesac,
            pricebottle: pricebottle,

            pricectns_cashvan : pricectns_cashvan,
            pricebox_cashvan : pricebox_cashvan,
            priceitem_cashvan : priceitem_cashvan,
            pricesac_cashvan : pricesac_cashvan,
            pricebottle_cashvan : pricebottle_cashvan,

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
            navigate(`/goods`, { replace: true });
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
                        Update  a product
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                        <TextField 
                            id="brand" 
                            label="Brand" 
                            variant="outlined" 
                            name="brand" 
                            onChange={(event) => setBrand(event.target.value)}
                            value={brand}
                            fullWidth
                        />
                        </Grid>
                        
                        <Tabs 
                            value={tabIndex} 
                            onChange={handleTabChange} 
                            centered 
                            sx={{ mb: 3 }}
                            >
                            <Tab label="Normal Prices" />
                            <Tab label="Cashvan Prices" />
                        </Tabs>
                        {tabIndex === 0 && (
                        <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricectns" 
                            label="Price per Carton" 
                            variant="outlined" 
                            name="pricectns" 
                            type="number"
                            onChange={(event) => setPricectns(event.target.value)}
                            value={pricectns}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricebox" 
                            label="Price per Pqt" 
                            variant="outlined" 
                            name="pricebox" 
                            type="number"
                            onChange={(event) => setPricebox(event.target.value)}
                            value={pricebox}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="priceitem" 
                            label="Price per Piece" 
                            variant="outlined" 
                            name="priceitem" 
                            type="number"
                            onChange={(event) => setPriceitem(event.target.value)}
                            value={priceitem}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricesac" 
                            label="Price per Sac" 
                            variant="outlined" 
                            name="pricesac" 
                            type="number"
                            onChange={(event) => setPricesac(event.target.value)}
                            value={pricesac}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <TextField 
                            id="pricebottle" 
                            label="Price per Bottle" 
                            variant="outlined" 
                            name="pricebottle" 
                            type="number"
                            onChange={(event) => setPricebottle(event.target.value)}
                            value={pricebottle}
                            fullWidth
                        />
                        </Grid>
                        </Grid>
                        )}
                        {tabIndex === 1 && (
                        <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricectns" 
                            label="Price per Carton" 
                            variant="outlined" 
                            name="pricectns" 
                            type="number"
                            onChange={(event) => setPricectns_cashvan(event.target.value)}
                            value={pricectns_cashvan}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricebox" 
                            label="Price per Pqt" 
                            variant="outlined" 
                            name="pricebox" 
                            type="number"
                            onChange={(event) => setPricebox_cashvan(event.target.value)}
                            value={pricebox_cashvan}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="priceitem" 
                            label="Price per Piece" 
                            variant="outlined" 
                            name="priceitem" 
                            type="number"
                            onChange={(event) => setPriceitem_cashvan(event.target.value)}
                            value={priceitem_cashvan}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            id="pricesac" 
                            label="Price per Sac" 
                            variant="outlined" 
                            name="pricesac" 
                            type="number"
                            onChange={(event) => setPricesac_cashvan(event.target.value)}
                            value={pricesac_cashvan}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <TextField 
                            id="pricebottle" 
                            label="Price per Bottle" 
                            variant="outlined" 
                            name="pricebottle" 
                            type="number"
                            onChange={(event) => setPricebottle_cashvan(event.target.value)}
                            value={pricebottle_cashvan}
                            fullWidth
                        />
                        </Grid>
                        </Grid>
                        )}
                       
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


export default UpdateGood;