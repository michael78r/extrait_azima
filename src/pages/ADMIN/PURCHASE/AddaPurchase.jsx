import React, { useState, useEffect, useContext, useMemo } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchGoodsLists } from '../GOODS/ApiGoodsList';
import { fetchGoodsCashvanLists } from '../GOODS/ApiGoodsCashvanList';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { TextField } from '@mui/material';

import { fetchGoodInventory } from '../INVENTORY/ApiGoodInventory';
import InputIcon from '@mui/icons-material/Input';



function PriceRow({ mypurchase,handleSacNumberChange, handleCtnNumberChange, handleBoxNumberChange, handleItemNumberChange,handleBottleNumberChange, handleDeleteItem, formatter }) {
    // const { mypurchase } = props;
    const [open, setOpen] = useState(false);
    
    return (
      <React.Fragment>
            <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell
                component="th"
                scope="row"
                // sx={{ 
                //     color: (mypurchase.stocknosacrestant < 0 || mypurchase.stocknoctnrestant < 0 || mypurchase.stocknoboxrestant < 0 || mypurchase.stocknoitemrestant < 0) ? 'red' : 'inherit'
                // }}
            >
                {mypurchase.brand}
            </TableCell>
            <TableCell align="right">{formatter.format(mypurchase.nosac)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.noctn)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.nobox)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.noitem)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.nobottle)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.valuesac)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.valuectn)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.valuebox)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.valueitem)}</TableCell>
            <TableCell align="right">{formatter.format(mypurchase.valuebottle)}</TableCell>
            <TableCell align="right"><strong>{formatter.format(mypurchase.totalvalue)}</strong></TableCell>
            <TableCell align="right"><Button startDecorator={<DeleteForeverIcon/>} onClick={() => handleDeleteItem(mypurchase.id)}>Delete</Button></TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Box sx={{
                        display: 'flex',
                        gap: '50px', 
                        padding: '16px',
                        justifyContent: 'flex-start',
                    }} >
                    <Typography gutterBottom component="div">
                        <p><strong>Price/Sac</strong> : {formatter.format(mypurchase.pricesac)}</p>
                        <p><strong>Price/Ctn</strong> : {formatter.format(mypurchase.pricectns)}</p>
                        <p><strong>Price/Pqt</strong> : {formatter.format(mypurchase.pricebox)}</p>
                        <p><strong>Price/Pcs</strong> : {formatter.format(mypurchase.priceitem)}</p>
                        <p><strong>Price/Btl</strong> : {formatter.format(mypurchase.pricebottle)}</p>
                    </Typography>
                    {/* <Typography gutterBottom component="div">
                        <p>
                            <strong>No of remaining sac</strong> : 
                            <span style={{ color: mypurchase.stocknosacrestant < 0 ? 'red' : 'inherit' }}>
                                {mypurchase.stocknosacrestant}
                            </span>
                        </p>
                        <p>
                            <strong>No of remaining carton</strong> : 
                            <span style={{ color: mypurchase.stocknoctnrestant < 0 ? 'red' : 'inherit' }}>
                                {mypurchase.stocknoctnrestant}
                            </span>
                        </p>
                        <p>
                            <strong>No of remaining packet</strong> : 
                            <span style={{ color: mypurchase.stocknoboxrestant < 0 ? 'red' : 'inherit' }}>
                                {mypurchase.stocknoboxrestant}
                            </span>
                        </p>
                        <p>
                            <strong>No of remaining piece</strong> : 
                            <span style={{ color: mypurchase.stocknoitem < 0 ? 'red' : 'inherit' }}>
                                {mypurchase.stocknoitemrestant}
                            </span>
                        </p>
                    </Typography> */}
                    </Box>
                    <TextField id="nosac" label="Number of sac" variant="outlined" name="nosac"
                        value={mypurchase.nosac} onChange={(event) => handleSacNumberChange(event, mypurchase.id)}
                    />
                    <TextField id="noctn" label="Number of cartons" variant="outlined" name="noctn"
                        value={mypurchase.noctn} onChange={(event) => handleCtnNumberChange(event, mypurchase.id)}
                    />
                    <TextField id="nobox" label="Number of packet" variant="outlined" name="nobox" 
                        value={mypurchase.nobox} onChange={(event) => handleBoxNumberChange(event, mypurchase.id)}
                    />
                    <TextField id="noitem" label="Number of piece" variant="outlined" name="noitem" 
                        value={mypurchase.noitem} onChange={(event) => handleItemNumberChange(event, mypurchase.id)}
                    />
                    
                    <TextField id="nobottle" label="Number of bottle" variant="outlined" name="nobottle" 
                        value={mypurchase.nobottle} onChange={(event) => handleBottleNumberChange(event, mypurchase.id)}
                    />
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </>
      </React.Fragment>
    );
}

function AddaPurchase() {
    document.title = "Make a purchase";
    const navigate = useNavigate();
    const formatter = useMemo(() => new Intl.NumberFormat('fr-FR'), []);
    const [isSaving, setIsSaving] = useState(false);
    const [goodsLists, setGoodsLists] = useState([]);
    const [purchaseValue, setPurchaseValue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cash, setCash] = useState(0);
    const [creditamount, setCreditamount] = useState(0);
    const [totalSum, setTotalSum] = useState(0);
    const [totalSold, setTotalSold] = useState(0);
    const textColor = totalSold === totalSum ? 'green' : 'red';
    // CURRENT SHOP
    const [shopId, setShopId] = useState(useParams().shopId);
    const [salesId, setSalesId] = useState(useParams().salesId);
    const [section, setSection] = useState('');
    const [location, setLocation] = useState('');
    const [shopname, setShopName] = useState('');
    const [phone, setPhone] = useState('');
    const [credit, setCredit] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    // INVOICE LABEL
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const [salesName, setSalesName] = useState('');
    const [formattedString, setFormattedString] = useState('');

    const [city,setCity] = useState({});

    const [isCanSellCash,setCanSellCash] = useState(false);
    const [isCashvan,setCashvan] = useState(false);

    //GEOLOCALISATION
    const latitude = -18.96033918827368;
    const longitude = 47.53187700585781;
    
    const handleSacNumberChange = (event, id) => {        
        const nosac = event.target.value;
        
        const updatedData = purchaseValue.map(item =>
            item.id === id ? { ...item, nosac: +nosac,stocknosacrestant : item.stocknosacinitiale - (+nosac) ,valuesac: nosac*item.pricesac, totalvalue: (nosac*item.pricesac) + item.valuectn + item.valuebox + item.valueitem + item.valuebottle } : item
        );
        setPurchaseValue(updatedData);
    };

    const handleCtnNumberChange = (event, id) => {        
        const noctn = event.target.value;
        const updatedData = purchaseValue.map(item =>
            item.id === id ? { ...item, noctn: +noctn, stocknoctnrestant: item.stocknoctninitiale - (+noctn),valuectn: noctn*item.pricectns, totalvalue: (noctn*item.pricectns) + item.valuebox + item.valueitem + item.valuesac + item.valuebottle } : item
        );
        setPurchaseValue(updatedData);
    };

    const handleBoxNumberChange = (event, id) => {
        const nobox = event.target.value;
        const updatedData = purchaseValue.map(item =>
            item.id === id ? { ...item, nobox: +nobox, stocknoboxrestant: item.stocknoboxinitiale - (+nobox),valuebox: nobox*item.pricebox, totalvalue: (nobox*item.pricebox) + item.valuectn + item.valueitem + item.valuesac + item.valuebottle } : item
        );
        setPurchaseValue(updatedData);
    };

    const handleItemNumberChange = (event, id) => {
        const noitem = event.target.value;
        const updatedData = purchaseValue.map(item =>
            item.id === id ? { ...item, noitem: +noitem,stocknoitemrestant: item.stocknoiteminitiale - (+noitem),valueitem: noitem*item.priceitem, totalvalue: (noitem*item.priceitem) + item.valuectn + item.valuebox + item.valuesac + item.valuebottle } : item
        );
        setPurchaseValue(updatedData);
    };

    const handleBottleNumberChange = (event, id) => {
        const nobottle = event.target.value;
        const updatedData = purchaseValue.map(item =>
            item.id === id ? { ...item, nobottle: +nobottle,valuebottle: nobottle*item.pricebottle, totalvalue: (nobottle*item.pricebottle)+ item.valueitem + item.valuectn + item.valuebox + item.valuesac } : item
        );
        setPurchaseValue(updatedData);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
  
    
    useEffect(() => {
        setLoading(true);
     
            axios
            .get(`/api/sales/${salesId}`)
            .then((salesResponse) => {
            const sales = salesResponse.data;
            setSalesName(sales.name);
            setCanSellCash(sales.canSellCash);
            setCashvan(sales.isCashvan);

            const requests = [
                axios.get(`/api/shop/${shopId}`),
                sales.isCashvan ? fetchGoodsCashvanLists() : fetchGoodsLists(),
                axios.get(`/api/city/shop/${shopId}`),
              ];
          
            return Promise.all(requests);
            })
            .then(([shopData, goodsData, cityData]) => {
            const shop = shopData.data;
            setSection(shop.section);
            setLocation(shop.location);
            setShopName(shop.shopname);
            setPhone(shop.phone);
            setCredit(shop.creditLimit);

            setGoodsLists(goodsData);
            setCity(cityData.data);
      
            // setFormattedString(`${currentYear}/${currentMonth}/`);
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
    useEffect(() => {
        if (salesName) {
          console.log(`Bonjour ` + salesName);
          setFormattedString(`${currentYear}/${currentMonth}/${salesName}/`);
        }
    }, [salesName]);
      

    const annuler = () => {
        navigate(`/purchase`, { replace: true });
    }

    const handleSubmit = () => {
        const data = {
            cash: +cash,
            totalSum: +totalSum,
            idsalesman: salesId,
            idshop: shopId,
            latitude: latitude,
            longitude: longitude,
            creditAmount : +creditamount,
            cashAmount : +cash,
            label: formattedString,
            purchaseValue: purchaseValue,
            cityId :  city.id
        };
        setIsSaving(true);
        axios.post(`/api/addpurchase`, data)
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/purchase`, { replace: true });
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
    };

    const handleDeleteItem = (idToDelete) => {
        const updatedData = purchaseValue.filter(item => item.id !== idToDelete);
        setPurchaseValue(updatedData);
    };

    useEffect(() => {
        const total = purchaseValue.reduce((acc, item) => acc + item.totalvalue, 0);
        const hasNegativeStock = purchaseValue.some(item => 
            item.stocknosacrestant < 0 || 
            item.stocknoboxrestant < 0 || 
            item.stocknoitemrestant < 0 || 
            item.stocknoctnrestant < 0
        );
        setTotalSum(total);
        setTotalSold(Number(cash) + Number(creditamount));
        if (purchaseValue.length === 0 || total !== Number(cash) + Number(creditamount) ) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      }, [purchaseValue, cash, creditamount]);


        //auto remplir le cash 
    const handleFillCash = (event) => { 
        const total = purchaseValue.reduce((acc, item) => acc + item.totalvalue, 0);    
        setCash(total-creditamount);
    };

      //auto remplir le credit amount 
      const handleFillCreditAmount = (event) => { 
        const total = purchaseValue.reduce((acc, item) => acc + item.totalvalue, 0);    
        setCreditamount(total-cash);
    };


    return (
        <LayoutAdmin>
            <Box
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
            {loading ? (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open="true"
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                ) : (
                    <Box component="form">
                        <Grid container spacing={2}>
                            <Grid xs={4}>
                                <Item style={{ textAlign: 'left' }}>
                                    <h4><strong style={{ color: 'blue' }}>SHOP DETAILS :</strong></h4>
                                    <p><strong>Shop sales</strong> : {shopname}</p>
                                    <p><strong>Shop name</strong> : {location}</p>
                                    <p><strong>Section</strong> : {section}</p>
                                    <p><strong>Phone number</strong> : 0{phone}</p>
                                    {/* <p style={{ color: Number(credit) - Number(totalCredit) - Number(totalCash) < 0 ? 'red' : 'inherit' }}><strong>Credit limit remaining</strong> : {formatter.format(Number(credit) - Number(totalCredit) - Number(totalCash))}</p> */}
                                </Item>
                            </Grid>
                            <Grid xs={8}>
                                <form>
                                    <FormControl>
                                        <Autocomplete
                                            style={{ marginTop: '16px', maxWidth:'50%' }}
                                            options={goodsLists.map(good => ({
                                                id: good.id,
                                                brand: good.brand,
                                                pricectns: good.pricectns,
                                                pricebox: good.pricebox,
                                                priceitem: good.priceitem,
                                                pricesac: good.pricesac,
                                                pricebottle: good.pricebottle
                                            }))}
                                            onChange={async (event, newValue) => {
                                                if (newValue) {
                                                    const existingValue = purchaseValue.find(item => item.id === newValue.id);
                                                    if (existingValue) {
                                                        const updatedData = purchaseValue.map(item =>
                                                            item.id === newValue.id ? { 
                                                                ...item, 
                                                                brand: newValue.brand, 
                                                                pricebox: newValue.pricebox, 
                                                                pricectns: newValue.pricectns,
                                                                priceitem: newValue.priceitem,
                                                                pricesac: newValue.pricesac,
                                                                pricebottle: newValue.pricebottle

                                                            } : item
                                                        );
                                                        setPurchaseValue(updatedData);
                                                    } else {
                                                        try {
                                                          
                                                            const inventoryResponse = await fetchGoodInventory(newValue.id, city.id);
                                                            const inventoryData = inventoryResponse.length > 0 ? inventoryResponse[0] : null;
                                                            const inventoryDetails = inventoryData && inventoryData.inventories && inventoryData.inventories.length > 0
                                                                ? inventoryData.inventories[0]
                                                                : { cartonNumber: 0, boxNumber: 0, pieceNumber: 0, sacNumber: 0 };

                                                        const newData = {
                                                            id: newValue.id,
                                                            brand: newValue.brand,
                                                            pricectns: newValue.pricectns,
                                                            pricebox: newValue.pricebox,
                                                            priceitem: newValue.priceitem,
                                                            pricesac: newValue.pricesac,
                                                            pricebottle: newValue.pricebottle,
                                                            noctn: 0,
                                                            nobox: 0,
                                                            noitem: 0,
                                                            nosac: 0,
                                                            nobottle : 0,
                                                            valuectn: 0,
                                                            valuebox: 0,
                                                            valueitem: 0,
                                                            valuesac: 0,
                                                            valuebottle: 0,
                                                            totalvalue: 0,
                                                            stocknoctninitiale: inventoryDetails.cartonNumber,
                                                            stocknoboxinitiale: inventoryDetails.boxNumber,
                                                            stocknoiteminitiale: inventoryDetails.pieceNumber,
                                                            stocknosacinitiale: inventoryDetails.sacNumber,
                                                            stocknoctnrestant: inventoryDetails.cartonNumber,
                                                            stocknoboxrestant: inventoryDetails.boxNumber,
                                                            stocknoitemrestant: inventoryDetails.pieceNumber,
                                                            stocknosacrestant: inventoryDetails.sacNumber
                                                        };
                                                        setPurchaseValue([...purchaseValue, newData]);
                                                    } catch (error) {
                                                        console.error("Erreur lors de la récupération de l'inventaire:", error);
                                                    }
                                                    }
                                                }
                                            }}
                                            getOptionLabel={option => option.brand}
                                            placeholder="Choose a product"
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    label="Products" 
                                                    variant="outlined" 
                                                    fullWidth 
                                                />
                                            )}
                                        />
                                        <Button variant="contained"  style={{ marginTop: '16px', maxWidth:'25%' }} onClick={() => handleSubmit()} disabled={isDisabled}>Save orders</Button>
                                        <Button variant="outlined" color="error" style={{ marginTop: '16px', maxWidth:'25%' }} onClick={() => annuler()}>Cancel</Button>
                                    </FormControl>
                                </form>
                                <br />
                                <Grid container spacing={1} alignItems="center">
                                    {isCanSellCash && (
                                        <>
                                        <Grid item>
                                            <TextField 
                                            id="cash" 
                                            label="Cash" 
                                            variant="outlined" 
                                            name="cash"
                                            onChange={(event) => { setCash(event.target.value); }} 
                                            value={cash} 
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button 
                                            variant="text" 
                                            startIcon={<InputIcon sx={{ fontSize: 18 }} />} // Réduire la taille de l'icône
                                            onClick={handleFillCash} 
                                            sx={{ minWidth: 40, padding: '6px' }} // Taille plus compacte du bouton
                                            >
                                            </Button>
                                        </Grid>
                                        </>
                                            )}
                                        <Grid item>
                                            <TextField 
                                            id="credit" 
                                            label="Credit" 
                                            variant="outlined" 
                                            name="credit"
                                            onChange={(event) => { setCreditamount(event.target.value); }} 
                                            value={creditamount} 
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button 
                                            variant="text" 
                                            startIcon={<InputIcon sx={{ fontSize: 18 }} />} 
                                            onClick={handleFillCreditAmount} 
                                            sx={{ minWidth: 40, padding: '6px' }} 
                                            >
                                            </Button>
                                        </Grid>
                                    </Grid>
                                <p style={{ color: 'blue' }}><strong>{formatter.format(totalSum)}</strong></p>
                                <p style={{ color: textColor }}><strong>{formatter.format(totalSold)}</strong></p>
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Brand</TableCell>
                                        <TableCell align="right">Order/Sac</TableCell>
                                        <TableCell align="right">Order/Ctn</TableCell>
                                        <TableCell align="right">Order/Pqt</TableCell>
                                        <TableCell align="right">Order/Pcs</TableCell>
                                        <TableCell align="right">Order/Btl</TableCell>
                                        <TableCell align="right">Value/Sac</TableCell>
                                        <TableCell align="right">Value/Ctn</TableCell>
                                        <TableCell align="right">Value/Pqt</TableCell>
                                        <TableCell align="right">Value/Pcs</TableCell>
                                        <TableCell align="right">Value/Btl</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {purchaseValue.map((mypurchase) => (
                                        <PriceRow key={mypurchase.id} 
                                        mypurchase={mypurchase}
                                        city = {city}
                                        handleSacNumberChange={handleSacNumberChange}
                                        handleCtnNumberChange={handleCtnNumberChange}
                                        handleBoxNumberChange={handleBoxNumberChange}
                                        handleItemNumberChange={handleItemNumberChange}
                                        handleBottleNumberChange={handleBottleNumberChange}
                                        handleDeleteItem={handleDeleteItem}
                                        formatter={formatter} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </LayoutAdmin>
    );
}

export default AddaPurchase;