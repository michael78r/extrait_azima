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
import { fetchGoodsLists } from '../GOODS/ApiGoodsList';

function AddPromotion() {
    document.title = "Add a promotion";
    const navigate = useNavigate();
    const [goods, setGoods] = useState([]);
    const [selectedGood,setSelectedGood] = useState('');
    const unite = ["ctn","pqt","pcs","btl","sac"];
    const [selectedUnite,setSelectedUnite] = useState('');
    const [goodsFree, setGoodsFree] = useState([]);
    const [selectedGoodFree,setSelectedGoodFree] = useState('');
    const uniteFree = ["ctn","pqt","pcs","btl","sac"];
    const [selectedUniteFree,setSelectedUniteFree] = useState('');
    const [numberProductRequired,setNumberProductRequired] = useState(0);
    const [numberProductFree,setNumberProductFree] = useState(0);
    const [dateFin, setDateFin] = useState('');
    
    const [isSaving, setIsSaving] = useState(false);

    

    const [loading, setLoading] = useState(false);

    const username1 = useContext(MyContext);
    const annuler = () => {
        navigate(`/promotions`, { replace: true });
    }

    useEffect(() => {
        setLoading(true);
        fetchGoodsLists()
        .then(goodData => {
            const produits = goodData;
            setGoods(produits);
            setGoodsFree(produits);
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
        setIsSaving(true);
        const formData = {
            goodId: selectedGood.id,
            requiredNumberProduct: numberProductRequired,
            unite: selectedUnite,
            goodFreeId: selectedGoodFree.id,
            numberGoodFree: numberProductFree,
            uniteFree: selectedUniteFree,
            date_fin : dateFin,
    };
        
        axios.post(`/api/addpromotion`,formData)
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/promotions`, { replace: true });
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
                        Add a promotion
                        </Typography>
                        <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                        <Grid item xs={12}>  
                        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                        BUY
                        </Typography>
                        </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={goods}
                                    getOptionLabel={(option) => option.brand} 
                                    onChange={(event, newValue) => {
                                        setSelectedGood(newValue); 
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select a Brand" variant="outlined" />
                                    )}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="requiredProduct" label="Number of product required" variant="outlined" name="requiredProduct" 
                                            onChange={(event)=>{setNumberProductRequired(event.target.value)}}
                                            value={numberProductRequired} fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={unite}
                                    value={selectedUnite}
                                    onChange={(event, value) => setSelectedUnite(value)}
                                    renderInput={(params) => <TextField {...params} label="Select packages" />}
                                    sx={{ mb: 3 }}
                                    />
                            </Grid>
                            <Grid item xs={12}>       
                            <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                        FREE
                        </Typography>
                        </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={goods}
                                    getOptionLabel={(option) => option.brand} 
                                    onChange={(event, newValue) => {
                                        setSelectedGoodFree(newValue); 
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select a Brand for free" variant="outlined" />
                                    )}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="numberProductFree" label="Number of product free" variant="outlined" name="numberProductFree" 
                                            onChange={(event)=>{setNumberProductFree(event.target.value)}}
                                            value={numberProductFree} fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={uniteFree}
                                    value={selectedUniteFree}
                                    onChange={(event, value) => setSelectedUniteFree(value)}
                                    renderInput={(params) => <TextField {...params} label="Select packages" />}
                                    sx={{ mb: 3 }}
                                    />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                
                                variant="outlined"
                                label="End date for promotion (optional)"
                                fullWidth
                                type="date"
                                value={dateFin}
                                onChange={(event, value) => setDateFin(value)}
                                sx={{ mb: 3 }}
                                InputLabelProps={{ shrink: true }}
                                required
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
                )}
            </Container>
        </LayoutAdmin>
    );
}
export default AddPromotion;