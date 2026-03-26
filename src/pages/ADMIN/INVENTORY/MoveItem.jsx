import React, { useState, useEffect, useContext } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Grid, Autocomplete } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import LayoutAdmin from '../../LayoutAdmin';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';
import { fetchGoodInventory } from '../INVENTORY/ApiGoodInventory';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function MoveItem() {
    document.title = "Transfer stock";
    const navigate = useNavigate();
    const [goods, setGoods] = useState([]);
    const [selectedGoods, setSelectedGoods] = useState(null);
    const [fromCities, setFromCities] = useState([]);
    const [selectedFromCity, setSelectedFromCity] = useState(null);
    const [toCities, setToCities] = useState([]);
    const [selectedToCity, setSelectedToCity] = useState(null);

    const [inventory, setInventory] = useState({
        id: null,
        sacNumber: 0,
        cartonNumber: 0,
        boxNumber: 0,
        pieceNumber: 0,
        sacNumberRestant: 0,
        cartonNumberRestant: 0,
        boxNumberRestant: 0,
        pieceNumberRestant: 0,
    });
    const [nbSac, setNbSac] = useState(0);
    const [nbPiece, setNbPiece] = useState(0);
    const [nbBox, setNbBox] = useState(0);
    const [nbCarton, setNbCarton] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const getInventory = async () => {
        if (!selectedGoods || !selectedFromCity) {
            return;
        }
        try {
            const inventoryResponse = await fetchGoodInventory(selectedGoods.id, selectedFromCity.id);
            const inventoryData = inventoryResponse.length > 0 ? inventoryResponse[0] : null;
            const inventoryDetails = inventoryData && inventoryData.inventories && inventoryData.inventories.length > 0
                ? inventoryData.inventories[0]
                : { id: null, sacNumber: 0, cartonNumber: 0, boxNumber: 0, pieceNumber: 0 };
            
            const updatedInventoryDetails = {
                ...inventoryDetails,
                sacNumberRestant: inventoryDetails.sacNumber,
                cartonNumberRestant: inventoryDetails.cartonNumber,
                boxNumberRestant: inventoryDetails.boxNumber,
                pieceNumberRestant: inventoryDetails.pieceNumber,
            };
            console.log(updatedInventoryDetails);
            setInventory(updatedInventoryDetails);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'inventaire :", error);
            Swal.fire({
                icon: 'error',
                title: 'An Error Occurred!',
                text: 'Please try again later.',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };
    

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get(`/api/goods`),
            axios.get(`/api/cities`),
        ])
        .then(([goodData, cityData]) => {
            setGoods(goodData.data);
            setFromCities(cityData.data);
            setToCities(cityData.data);
            setLoading(false);
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500,
            });
            setLoading(false);
        });
    }, []);

    

    const username1 = useContext(MyContext);
    const annuler = () => {
        navigate(`/inventories`, { replace: true });
    };

    const handleSave = () => {
        if (selectedFromCity.id==selectedToCity.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Choose another city',
                showConfirmButton: true,
            });
            return;
        }

         setIsSaving(true);
        axios.post(`/api/goods/transfer`, {
            goodId :selectedGoods.id,
            fromCityId : selectedFromCity.id,
            toCityId : selectedToCity.id,
            sacNumber : nbSac,
            boxNumber: nbBox,
            pieceNumber : nbPiece,
            cartonNumber : nbCarton
        })
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500,
            });
            setIsSaving(false);
            navigate(`/inventories`, { replace: true });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'There is at least one error with your data!',
                showConfirmButton: false,
                timer: 1500,
            });
            setIsSaving(false);
        });
    };

    const handleCartonNumberChange = (carton) => {
        setNbCarton(carton)
        setInventory((prevInventory) => ({
            ...prevInventory,
            cartonNumberRestant: prevInventory.cartonNumber-carton,
        }));
    };
    const handleBoxNumberChange = (box) => {
        setNbBox(box)
        setInventory((prevInventory) => ({
            ...prevInventory,
            boxNumberRestant: prevInventory.boxNumber-box,
        }));
    };
    const handlePieceNumberChange = (piece) => {
        setNbPiece(piece)
        setInventory((prevInventory) => ({
            ...prevInventory,
            pieceNumberRestant: prevInventory.pieceNumber-piece,
        }));
    };
    const handleSacNumberChange = (sac) => {
        setNbSac(sac)
        setInventory((prevInventory) => ({
            ...prevInventory,
            sacNumberRestant: prevInventory.sacNumber-sac,
        }));
    };

    useEffect(()=>{
        setLoading(true);
        getInventory();
        setLoading(false);
    },[selectedGoods,selectedFromCity]);

    return (
        <LayoutAdmin>
           <Container maxWidth="sm"  >
           {loading ? (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open="true"
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    Transfer Stock
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={goods}
                                getOptionLabel={(option) => option.brand}
                                onChange={async(event, newValue) => {
                                    setSelectedGoods(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select a product" variant="outlined" />
                                )}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={fromCities}
                                getOptionLabel={(option) => option.cityname}
                                onChange={(event, newValue) => {
                                    setSelectedFromCity(newValue);                
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select the city to source stock from" variant="outlined" />
                                )}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <Typography gutterBottom component="div">
                            <p>
                                <strong>No of remaining sac</strong> :
                                <span style={{ color: inventory.sacNumberRestant <= 0 ? 'red' : 'inherit' }}>
                                    {inventory.sacNumberRestant}
                                </span>
                            </p>
                            <p>
                                <strong>No of remaining carton</strong> :
                                <span style={{ color: inventory.cartonNumberRestant <= 0 ? 'red' : 'inherit' }}>
                                    {inventory.cartonNumberRestant}
                                </span>
                            </p>
                            <p>
                                <strong>No of remaining packet</strong> :
                                <span style={{ color: inventory.boxNumberRestant <=0 ? 'red' : 'inherit' }}>
                                    {inventory.boxNumberRestant}
                                </span>
                            </p>
                            <p>
                                <strong>No of remaining piece</strong> :
                                <span style={{ color: inventory.pieceNumberRestant <= 0 ? 'red' : 'inherit' }}>
                                    {inventory.pieceNumberRestant}
                                </span>
                            </p>
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={toCities}
                                getOptionLabel={(option) => option.cityname}
                                onChange={(event, newValue) => {
                                    setSelectedToCity(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select the city to transfer stock to" variant="outlined" />
                                )}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nbSac"
                                label="Number of Sac"
                                variant="outlined"
                                name="nbSac"
                                type="number"
                                onChange={(event) => handleSacNumberChange(event.target.value)}
                                value={nbSac}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nbCarton"
                                label="Number of Carton"
                                variant="outlined"
                                name="nbCarton"
                                type="number"
                                onChange={(event) => handleCartonNumberChange(event.target.value)}
                                value={nbCarton}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nbBox"
                                label="Number of Pqt"
                                variant="outlined"
                                name="nbBox"
                                type="number"
                                onChange={(event) => handleBoxNumberChange(event.target.value)}
                                value={nbBox}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="nbPiece"
                                label="Number of Piece"
                                variant="outlined"
                                name="nbPiece"
                                type="number"
                                onChange={(event) => handlePieceNumberChange(event.target.value)}
                                value={nbPiece}
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
                            {isSaving ? 'Saving...' : 'Transfer'}
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
            </Box> 
            )}     
    </Container>

        </LayoutAdmin>
    );
}
export default MoveItem;