import React, { useState,useEffect } from 'react'; 
import { Container, Paper, Typography, Box, Grid, TextField, Button ,Autocomplete} from '@mui/material';

    import LayoutAdmin from '../../LayoutAdmin';
    import { fetchGoodsLists } from '../GOODS/ApiGoodsList';
    import Swal from 'sweetalert2'
    import {useNavigate} from 'react-router-dom';
    import axios from 'axios';
         
    const AddItem = () =>{
        document.title = "Add item";
        const [brands,setBrands] = useState([]);
        const [selectedBrand,setSelectedBrand] = useState();
        const [cities,setCities] = useState([]);
        const [selectedCity,setSelectedCity] = useState();
        const [nbBox,setNbBox] = useState(0);
        const [nbCarton,setNbCarton] = useState(0);
        const [nbPiece,setNbPiece] = useState(0);
        const [nbSac,setNbSac] = useState(0);

        const [loading, setLoading] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const navigate = useNavigate();

        
        useEffect(() => {
            setLoading(true);
            Promise.all([
                axios.get(`/api/cities`),
                fetchGoodsLists()
            ])
            .then(([citiesData,goodsData]) => {
           
                setCities(citiesData.data);
                setBrands(goodsData);
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
            let formData = new FormData()
            formData.append("idBrand", selectedBrand.id)
            formData.append("idCity", selectedCity.id)
            formData.append("nbBox", nbBox)
            formData.append("nbPiece", nbPiece)
            formData.append("nbSac", nbSac)
            formData.append("nbCarton", nbCarton)
            axios.post(`/api/addinventory`, formData)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    showConfirmButton: false,
                    timer: 1500
                })
                setIsSaving(false);
                navigate(`/inventories`, { replace: true });
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
    
        };

        const annuler = ()=>{
            navigate(`/inventories`);
        };
        return (
            <LayoutAdmin>
                <Container maxWidth="sm">
                    <Paper elevation={4} sx={{ padding: 4, mt: 5, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Add inventory
                        </Typography>
                        <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                            <Autocomplete
                                options={brands}
                                getOptionLabel={(option) => option.brand} 
                                onChange={(event, newValue) => {
                                    setSelectedBrand(newValue); 
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select a Brand" variant="outlined" />
                                )}
                                fullWidth
                            />
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
                            <Grid item xs={12} sm={6}>
                            <TextField 
                                id="numberctns" 
                                label="Number of carton" 
                                variant="outlined" 
                                name="numberctns" 
                                type="number"
                                onChange={(event) => setNbCarton(event.target.value)}
                                value={nbCarton}
                                fullWidth
                            />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <TextField 
                                id="numberbox" 
                                label="Number of pqt" 
                                variant="outlined" 
                                name="numberbox" 
                                type="number"
                                onChange={(event) => setNbBox(event.target.value)}
                                value={nbBox}
                                fullWidth
                            />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <TextField 
                                id="numberpiece" 
                                label="Number of Piece" 
                                variant="outlined" 
                                name="numberpiece" 
                                type="number"
                                onChange={(event) => setNbPiece(event.target.value)}
                                value={nbPiece}
                                fullWidth
                            />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <TextField 
                                id="numbersac" 
                                label="Number of Sac" 
                                variant="outlined" 
                                name="numbersac" 
                                type="number"
                                onChange={(event) => setNbSac(event.target.value)}
                                value={nbSac}
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

export default AddItem;