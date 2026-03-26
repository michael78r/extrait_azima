import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/joy/Button';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { fetchPurchaseInvoice } from './ApiPurchaseInvoice';
import formaterNombre from '../../formaterNombre';
import EditIcon from '@mui/icons-material/Edit';

function EditPurchase() {
    document.title = "Edit a purchase";
    const navigate = useNavigate();
    const formatter = new Intl.NumberFormat('fr-FR');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [goodsLists, setGoodsLists] = useState([]);
    const {id} = useParams();
    // CURRENT SHOP
    const [section, setSection] = useState('');
    const [location, setLocation] = useState('');
    const [shopname, setShopName] = useState('');
    const [phone, setPhone] = useState('');
    //CURRENT PURCHASE
    const [itemNumber, setItemNumber] = useState('');
    const [cartonNumber, setCartonNumber] = useState('');
    const [sacNumber, setSacNumber] = useState('');
    const [boxNumber, setBoxNumber] = useState('');
    const [bottleNumber, setBottleNumber] = useState('');
    const [totalitemvalue,setTotalitemvalue] = useState('');
    const [totalctnsvalue, setTotalctnsvalue] = useState('');
    const [totalsacvalue,setTotalsacvalue] = useState('');
    const [totalboxvalue, setTotalboxvalue] = useState('');
    const [totalbottlevalue, setTotalbottlevalue] = useState('');
    const [totalvalue, setTotalvalue] = useState('');
    //CURRENT BRAND
    const [brandId, setBrandId] = useState('');
    const [brand, setBrand] = useState('');
    const [pricectns, setPricectns] = useState('');
    const [pricebox, setPricebox] = useState('');
    const [pricesac, setPricesac] = useState('');
    const [priceitem, setPriceitem] = useState('');
    const [pricebottle, setPricebottle] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    //CURRENT INVOICE
    const [invoiceId, setInvoiceId] = useState('');
    const [label, setLabel] = useState('');
    const [totalSum, setTotalSum] = useState(0);
    const [totalSold, setTotalSold] = useState(0);
    const [cash, setCash] = useState(0);
    const [creditamount, setCreditamount] = useState(0);
    const textColor = totalSold === totalSum ? 'green' : 'red';

    
    const handleCtnNumberChange = (event) => {        
        const noctn = event.target.value;
        const updatedCtnValue = +noctn * +pricectns;
        setCartonNumber(+noctn);
        setTotalctnsvalue(+updatedCtnValue);
        setTotalvalue(+updatedCtnValue + +totalitemvalue + +totalsacvalue + +totalboxvalue + +totalbottlevalue);
    };
    const handleSacNumberChange = (event) => {        
        const nosac = event.target.value;
        const updatedSacValue = +nosac * +pricesac;
        setSacNumber(+nosac);
        setTotalsacvalue(+updatedSacValue);
        setTotalvalue(+updatedSacValue + +totalitemvalue + +totalctnsvalue + +totalboxvalue + +totalbottlevalue);
    };
    const handleItemNumberChange = (event) => {        
        const noitem = event.target.value;
        const updatedItemValue = +noitem * +priceitem;
        setItemNumber(+noitem);
        setTotalctnsvalue(+updatedItemValue);
        setTotalvalue(+updatedItemValue + +totalsacvalue + +totalboxvalue + +totalctnsvalue + +totalbottlevalue);
    };

    const handleBoxNumberChange = (event) => {
        const nobox = event.target.value;
        const updatedBoxValue = +nobox * +pricebox;
        setBoxNumber(+nobox);
        setTotalboxvalue(+updatedBoxValue);
        setTotalvalue(+updatedBoxValue + +totalctnsvalue + +totalsacvalue + +totalitemvalue + +totalbottlevalue);
    };

    const handleBottleNumberChange = (event) => {
        const nobottle = event.target.value;
        const updatedBottleValue = +nobottle * +pricebottle;
        setBottleNumber(+nobottle);
        setTotalbottlevalue(+updatedBottleValue);
        setTotalvalue(+updatedBottleValue + +totalctnsvalue + +totalsacvalue + +totalitemvalue + +totalboxvalue);
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
        fetchPurchaseInvoice(id)
        .then(purchaseData => {
            const purchase = purchaseData[0];
            setItemNumber(purchase.p_ItemNumber);
            setCartonNumber(purchase.p_CartonNumber);
            setSacNumber(purchase.p_SacNumber);
            setBoxNumber(purchase.p_BoxNumber);
            setBottleNumber(purchase.p_BottleNumber);
            setTotalitemvalue(purchase.p_Totalitemvalue);
            setTotalctnsvalue(purchase.p_Totalctnsvalue);
            setTotalboxvalue(purchase.p_Totalboxvalue);
            setTotalsacvalue(purchase.p_Totalsacvalue);
            setTotalbottlevalue(purchase.p_Totalbottlevalue);
            setTotalvalue(purchase.p_Totalvalue);
            setBrandId(purchase.b_id);
            setBrand(purchase.b_Brand);
            setPricectns(purchase.b_Pricectns);
            setPricebox(purchase.b_Pricebox);
            setPriceitem(purchase.b_Priceitem);
            setPricesac(purchase.b_Pricesac);
            setPricebottle(purchase.b_Pricebottle);
            setInvoiceId(purchase.i_id)
            setLabel(purchase.i_Label);
            setSection(purchase.s_Section);
            setLocation(purchase.s_Location);
            setShopName(purchase.s_ShopName);
            setPhone(purchase.s_Phone);
            console.log(purchase.p_ItemNumber);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const annuler = () => {
        navigate(`/purchase`, { replace: true });
    }

    const handleSubmit = () => {
        setLoading(true);
        const data = { 
            nobox: boxNumber,
            noitem : itemNumber,
            noctn: cartonNumber,
            nosac  : sacNumber,
            nobottle  : bottleNumber,
            brandId: brandId,
            valueitem: totalitemvalue,
            valuectn: totalctnsvalue,
            valuebox: totalboxvalue,
            valuesac: totalsacvalue,
            valuebottle: totalbottlevalue,
            totalvalue: totalvalue,
            priceitem : priceitem,
            pricebox  : pricebox ,
            pricebtl  : pricebottle,
            pricesac  : pricesac,
            pricectn   : pricectns 

        };
        setIsSaving(true);
        axios.patch(`/api/editpurchase/${id}`, data)
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            setLoading(false);
            navigate(`/purchase`, { replace: true });
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'There is at least one error with your data!',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false);
            setIsSaving(false);
        });
    };

    useEffect(() => {
        if (Number(totalSold) === Number(totalSum)) {
          setIsDisabled(false);
        } else {
          setIsDisabled(true);
        }
      }, [totalSold, totalSum]);

      const handlePriceBoxChange = (event) => {
        const newPriceBox = event.target.value;
        setPricebox(newPriceBox); 
        const updatedBoxValue = +boxNumber * +newPriceBox;
        setTotalboxvalue(updatedBoxValue);
        setTotalvalue(updatedBoxValue + +totalctnsvalue + +totalsacvalue + +totalitemvalue + +totalbottlevalue);
    };
    
    const handlePricePcsChange = (event) => {
        const newPriceItem = event.target.value;
        setPriceitem(newPriceItem);
        const updatedItemValue = +itemNumber * +newPriceItem;
        setTotalctnsvalue(updatedItemValue);
        setTotalvalue(updatedItemValue + +totalsacvalue + +totalboxvalue + +totalctnsvalue + +totalbottlevalue);
    };
    const handlePriceSacChange = (event) => {
        const newPriceSac = event.target.value;
        setPricesac(newPriceSac); // Met à jour le prix du sac
    
        // Recalculer la valeur totale du sac si nécessaire
        const updatedSacValue = +sacNumber * +newPriceSac;
        setTotalsacvalue(updatedSacValue);
    
        // Mettre à jour la valeur totale
        setTotalvalue(updatedSacValue + +totalitemvalue + +totalctnsvalue + +totalboxvalue + +totalbottlevalue);
    };
    
    const handlePriceBtlChange = (event) => {
        const newPriceBottle = event.target.value;
        setPricebottle(newPriceBottle);
        const updatedBottleValue = +bottleNumber * +newPriceBottle;
        setTotalbottlevalue(updatedBottleValue);
        setTotalvalue(updatedBottleValue + +totalctnsvalue + +totalsacvalue + +totalitemvalue + +totalboxvalue);
    };
    
    const handlePriceCtnChange = (event) => {
        const newPriceCtn = event.target.value;
        setPricectns(newPriceCtn);
        const updatedCtnValue = +cartonNumber * +newPriceCtn;
        setTotalctnsvalue(updatedCtnValue);
        setTotalvalue(updatedCtnValue + +totalitemvalue + +totalsacvalue + +totalboxvalue + +totalbottlevalue);
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
                                <Item>
                                    <h4><strong style={{ color: 'blue' }}>SHOP DETAILS :</strong></h4>
                                    <p><strong>Section</strong> : {section}</p>
                                    <p><strong>Location</strong> : {location}</p>
                                    <p><strong>Shop name</strong> : {shopname}</p>
                                    <p><strong>Phone</strong> : 0{phone}</p>
                                    {/* <p style={{ color: Number(credit) - Number(totalCredit) - Number(totalCash) < 0 ? 'red' : 'inherit' }}><strong>Credit limit remaining</strong> : {formatter.format(Number(credit) - Number(totalCredit) - Number(totalCash))}</p> */}
                                </Item>
                            </Grid>
                            <Grid xs={8}>
                                
                            <p>Invoice number: <b>{label}</b></p>
                           
                                <Button variant="solid" style={{ marginTop: '16px', maxWidth:'25%' }} onClick={() => handleSubmit()} disabled={isDisabled}>Update order</Button>
                                
                                <Button variant="solid" style={{ marginTop: '16px', maxWidth:'25%' }} onClick={() => annuler()}>Cancel</Button>
                                 <p><strong>{formaterNombre(totalvalue)}</strong></p>
                                {/* <br /><br />
                                <p><strong>{formatter.format(totalSum)}</strong></p>
                                <TextField id="cash" label="Cash" variant="outlined" name="cash" 
                                    onChange={(event)=>{setCash(event.target.value)}} value={cash} 
                                />
                                <TextField id="credit" label="Credit" variant="outlined" name="credit" 
                                    onChange={(event)=>{setCreditamount(event.target.value)}} value={creditamount} 
                                /> 
                                <p><strong>{formatter.format(totalSold)}</strong></p> */}
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{brand}</TableCell>
                                        <TableCell align="right">{formaterNombre(sacNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(cartonNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(boxNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(itemNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(bottleNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalsacvalue)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalctnsvalue)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalboxvalue)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalitemvalue)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalbottlevalue)}</TableCell>
                                        <TableCell align="right">{formaterNombre(totalvalue)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ margin: 1 }}>
                            <Box sx={{
                        display: 'flex',
                        gap: '50px', 
                        padding: '16px',
                        justifyContent: 'flex-start',
                    }} >
                                {/* <Typography gutterBottom component="div">
                                    <p><strong>Price/Sac</strong> : {formatter.format(pricesac)}</p>
                                    <p><strong>Price/Ctn</strong> : {formatter.format(pricectns)}</p>
                                    <p><strong>Price/Pqt</strong> : {formatter.format(pricebox)}</p>
                                    <p><strong>Price/Pcs</strong> : {formatter.format(priceitem)}</p>
                                    <p><strong>Price/Btl</strong> : {formatter.format(pricebottle)}</p>
                                </Typography> */}
                                <Typography gutterBottom component="div">
                                <Box display="flex" alignItems="center" gap={1}>
  <Typography variant="body1">Price/Sac:</Typography>
  <TextField
    type="number"
    value={pricesac}
    onChange={(event) => handlePriceSacChange(event)}
    fullWidth
    margin="normal"
    placeholder="Enter price per sac"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f0f0f0', // Fond légèrement foncé
        borderRadius: '4px',        // Légèrement arrondi
        padding: '0 8px',           // Ajout de padding interne
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none', // Supprime la bordure par défaut
      },
    }}
  />
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <Typography variant="body1">Price/Ctn:</Typography>
  <TextField
    type="number"
    value={pricectns}
    onChange={(event) => handlePriceCtnChange(event)}
    fullWidth
    margin="normal"
    placeholder="Enter price per ctn"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        padding: '0 8px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    }}
  />
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <Typography variant="body1">Price/Pqt:</Typography>
  <TextField
    type="number"
    value={pricebox}
    onChange={(event) => handlePriceBoxChange(event)}
    fullWidth
    margin="normal"
    placeholder="Enter price per pqt"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        padding: '0 8px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    }}
  />
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <Typography variant="body1">Price/Pcs:</Typography>
  <TextField
    type="number"
    value={priceitem}
    onChange={(event) => handlePricePcsChange(event)}
    fullWidth
    margin="normal"
    placeholder="Enter price per pcs"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        padding: '0 8px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    }}
  />
</Box>

<Box display="flex" alignItems="center" gap={1}>
  <Typography variant="body1">Price/Btl:</Typography>
  <TextField
    type="number"
    value={pricebottle}
    onChange={(event) => handlePriceBtlChange(event)}
    fullWidth
    margin="normal"
    placeholder="Enter price per btl"
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        padding: '0 8px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    }}
  />
</Box>

      </Typography>
                                </Box>
                                <TextField id="nosac" label="Number of sacs" variant="outlined" name="nosac"
                                    value={sacNumber} onChange={(event) => handleSacNumberChange(event)}
                                />
                                <TextField id="noctn" label="Number of cartons" variant="outlined" name="noctn"
                                    value={cartonNumber} onChange={(event) => handleCtnNumberChange(event)}
                                />
                                  <TextField id="nobox" label="Number of paquets" variant="outlined" name="nobox"
                                    value={boxNumber} onChange={(event) => handleBoxNumberChange(event)}
                                />
                                <TextField id="noitem " label="Number of pieces" variant="outlined" name="noitem" 
                                    value={itemNumber} onChange={(event) => handleItemNumberChange(event)}
                                />
                                <TextField id="nobottle " label="Number of bottles" variant="outlined" name="nobottle" 
                                    value={bottleNumber} onChange={(event) => handleBottleNumberChange(event)}
                                />
                           </Box>
                    </Box>
                )}
            </Box>
        </LayoutAdmin>
    );
}

export default EditPurchase;