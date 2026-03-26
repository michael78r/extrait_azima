import React, {useState, useEffect, useContext} from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Grid , Tabs, Tab} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import LayoutAdmin from '../../LayoutAdmin';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';

function AddGood() {
    document.title = "Add a product";
    const navigate = useNavigate();
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
    const [isSaving, setIsSaving] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const username1 = useContext(MyContext);
    const annuler = () => {
        navigate(`/goods`, { replace: true });
    }
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
      };

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
        let formData = new FormData()
        formData.append("brand", brand)
        formData.append("pricectns", pricectns)
        formData.append("pricebox", pricebox)
        formData.append("priceitem", priceitem)
        formData.append("pricesac", pricesac)
        formData.append("pricebottle", pricebottle)
        formData.append("pricectns_cashvan", pricectns_cashvan)
        formData.append("pricebox_cashvan", pricebox_cashvan)
        formData.append("priceitem_cashvan", priceitem_cashvan)
        formData.append("pricesac_cashvan", pricesac_cashvan)
        formData.append("pricebottle_cashvan", pricebottle_cashvan)
        formData.append("utilisateur", username1);
        axios.post(`/api/addgood`, formData)
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
            setIsSaving(false);
        });
    }
    return (
        <LayoutAdmin>
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    Add a product
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
export default AddGood;