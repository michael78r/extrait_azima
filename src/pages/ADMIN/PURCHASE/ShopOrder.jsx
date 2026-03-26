import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Table, TableBody, Button, TableHead, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import RoomIcon from '@mui/icons-material/Room';
import formaterNombre from '../../formaterNombre';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShopOrder = ({ data, formatter, editPurchase, handleDelete }) => {
    const [openShop, setOpenShop] = useState(true);
    const navigate = useNavigate();
    const [promotionInvoice, setPromotionInvoice] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [clickedFinished, setClickedFinished] = useState(false);
    const [color, setColor] = useState();

    const [clickedCanceled, setClickedCanceled] = useState(false);
    const handleUpdateOrder = () => {
        navigate(`/addapurchase/${data[0].invoice.Shop.id}/${data[0].invoice.Sales.id}/${data[0].invoice.id}`);
    }

    const getColor = (etat) => {
        if (etat === 0) return 'black';
        if (etat === 1) return 'green';
        if (etat === 2) return 'orange';
    };

    const updateInvoiceEtat = async (id, etat) => {
        try {
            const response = await axios.put(`/api/invoice/${id}/etat/${etat}`);
            console.log('État mis à jour :', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error.response?.data || error.message);
            throw error;
        }
    };

    // const handleFinished = () => {

    //     // setColor('green');
    //     setClickedFinished(true)
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Finished!',
    //         showConfirmButton: false,
    //         timer: 900
    //     })
    // }

    // const handleCanceled = () => {
    //     // setColor('orange');
    //     setClickedFinished(true)
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Canceled!',
    //         showConfirmButton: false,
    //         timer: 900
    //     })
    // }

    useEffect(() => {
        setLoading(true);

        axios.get(`/api/promotion/invoice/${data[0].invoice.id}`)
            .then(data => {
                setPromotionInvoice(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleViewInvoice = () => {
        let paymentType = '';
        if (data[0].invoice.cashAmount != 0 && data[0].invoice.creditAmount == 0) {
            paymentType = 'cash';
        }
        else if (data[0].invoice.cashAmount == 0 && data[0].invoice.creditAmount != 0) {
            paymentType = 'credit';
        }
        else if (data[0].invoice.cashAmount != 0 && data[0].invoice.creditAmount != 0) {
            paymentType = 'both';
        }
        const invoiceData = {
            date: data[0].Date,
            time: data[0].DateTime,
            name: data[0].invoice.Sales.Name,
            invoicelabel: data[0].invoice.Label,
            paymentType: paymentType,
            creditAmount: data[0].invoice.creditAmount,
            cashAmount: data[0].invoice.cashAmount,
            shopName: data[0].invoice.Shop.ShopName,
            location: data[0].invoice.Shop.Location,
            noMobile: data[0].invoice.Shop.Phone,
            items: data.map(order => ({
                brand: order.IdBrand.Brand,
                boxNumber: order.BoxNumber,
                itemNumber: order.ItemNumber,
                cartonNumber: order.CartonNumber,
                sacNumber: order.SacNumber,
                bottleNumber: order.BottleNumber,
                priceBox: order.pricebox,
                priceCarton: order.pricectn,
                priceItem: order.priceitem,
                priceSac: order.pricesac,
                priceBottle: order.pricebtl,
                totalItemValue: order.Totalitemvalue,
                totalCtnsValue: order.Totalctnsvalue,
                totalBoxValue: order.Totalboxvalue,
                totalSacValue: order.Totalsacvalue,
                totalBottleValue: order.Totalbottlevalue,
                totalValue: order.Totalvalue,
            })),
            promotions: Array.isArray(promotionInvoice) && promotionInvoice.length > 0 ? promotionInvoice.map(prom => {
                let promotionData = {
                    brand: prom.goodFree,
                    boxNumber: 0,
                    itemNumber: 0,
                    cartonNumber: 0,
                    sacNumber: 0,
                    bottleNumber: 0,
                    priceBox: 0,
                    priceCarton: 0,
                    priceItem: 0,
                    priceSac: 0,
                    priceBottle: 0,
                    totalItemValue: 0,
                    totalCtnsValue: 0,
                    totalBoxValue: 0,
                    totalSacValue: 0,
                    totalBottleValue: 0,
                    totalValue: 0,
                };

                // Mise à jour des propriétés en fonction de l'unité (unite)
                switch (prom.uniteFree) {
                    case 'pqt':
                        promotionData.boxNumber = prom.numberProductFree;
                        promotionData.priceBox = 'free';
                        promotionData.totalItemValue = 'free';
                        break;
                    case 'pcs':
                        promotionData.itemNumber = prom.numberProductFree;
                        promotionData.priceItem = 'free';
                        promotionData.totalBoxValue = 'free';
                        break;
                    case 'ctn':
                        promotionData.cartonNumber = prom.numberProductFree;
                        promotionData.priceCarton = 'free';
                        promotionData.totalCtnsValue = 'free';
                        break;
                    case 'sac':
                        promotionData.sacNumber = prom.numberProductFree;
                        promotionData.priceSac = 'free';
                        promotionData.totalSacValue = 'free';
                        break;
                    case 'btl':
                        promotionData.bottleNumber = prom.numberProductFree;
                        promotionData.priceBottle = 'free';
                        promotionData.totalBottleValue = 'free';
                        break;
                }

                return promotionData;
            }) : []
        };
        sessionStorage.setItem('invoiceData', JSON.stringify(invoiceData));
        window.open('/facture', '_blank');
        setClicked(true);
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenShop(!openShop)}
                    >
                        {openShop ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={6} style={{ fontWeight: 'bold', padding: '16px' }}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Box>Shop name: {data[0].invoice.Shop.ShopName}
                            <Tooltip title={data[0].invoice.Longitude + " -" + data[0].invoice.Latitude}>
                                <IconButton
                                    component="a"
                                    href={`https://www.google.com/maps/search/?api=1&query=${data[0].invoice.Latitude},${data[0].invoice.Longitude}&zoom=20`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View on Google Maps"
                                >
                                    <RoomIcon />
                                </IconButton>
                            </Tooltip> Time : {data[0].DateTime}
                        </Box>
                        <Tooltip title={data[0].invoice.Label}>
                            <div style={{ display: 'flex' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateOrder}
                                    style={{ margin: '10px 10px 10px 0' }}
                                >
                                    Add new order
                                </Button>

                                <Button
                                    variant="contained"
                                    color={clicked ? 'secondary' : 'primary'}
                                    onClick={handleViewInvoice}
                                    style={{ margin: '10px 10px 10px 0' }}
                                >
                                    View Invoice
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={clickedFinished}
                                     onClick={() => updateInvoiceEtat(data[0].invoice.id, 1)}
                                    style={{ margin: '10px 10px 10px 0' }}
                                >
                                    Finished
                                </Button>

                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={clickedFinished}
                                    onClick={() => updateInvoiceEtat(data[0].invoice.id, 2)}
                                    style={{ margin: '10px 10px 10px 0' }}
                                >
                                    Canceled
                                </Button>
                            </div>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openShop} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Brand</TableCell>
                                        {/* <TableCell align="center">Time</TableCell> */}
                                        <TableCell align="center">Sac</TableCell>
                                        <TableCell align="center">Ctn</TableCell>
                                        <TableCell align="center">Pqt</TableCell>
                                        <TableCell align="center">Pcs</TableCell>
                                        <TableCell align="center">Btl</TableCell>
                                        <TableCell align="center">Sac value</TableCell>
                                        <TableCell align="center">Ctn value</TableCell>
                                        <TableCell align="center">Pqt value</TableCell>
                                        <TableCell align="center">Pcs value</TableCell>
                                        <TableCell align="center">Btl value</TableCell>
                                        <TableCell align="center">Total value</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell align="left" style={{ color: getColor(order.invoice.etat) }}>
                                                {order.IdBrand.Brand}
                                            </TableCell>
                                            {/* <TableCell align="left">{order.DateTime}</TableCell> */}
                                            <TableCell align="center">{order.SacNumber}</TableCell>
                                            <TableCell align="center">{order.CartonNumber}</TableCell>
                                            <TableCell align="center">{order.BoxNumber}</TableCell>
                                            <TableCell align="center">{order.ItemNumber}</TableCell>
                                            <TableCell align="center">{order.BottleNumber}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalsacvalue)}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalctnsvalue)}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalboxvalue)}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalitemvalue)}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalbottlevalue)}</TableCell>
                                            <TableCell align="center">{formaterNombre(order.Totalvalue)}</TableCell>
                                            <TableCell >
                                                <IconButton onClick={() => editPurchase(order.id)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(order.id)}>
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ShopOrder;