import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Table, TableBody, Button, TableHead } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ShopOrder = ({ shopName, data, formatter, editPurchase, handleDelete }) => {
    const [openShop, setOpenShop] = useState(false);
    const navigate = useNavigate();

    const handleUpdateOrder = () => {
      
         navigate(`/addapurchase/${data[0].invoice.Shop.id}/${data[0].invoice.Sales.id}/${data[0].invoice.id}`);
    }
    console.log(data);

    const handleViewInvoice = () => {
       
        let paymentType = '';
        if(data[0].invoice.cashAmount!=0 && data[0].invoice.creditAmount==0){
            paymentType = 'cash';
        }
        else if(data[0].invoice.cashAmount==0 && data[0].invoice.creditAmount!=0){
            paymentType = 'credit';
        }
        else if(data[0].invoice.cashAmount!=0 && data[0].invoice.creditAmount!=0){
            paymentType = 'both';
        }
        const invoiceData = {
            date: data[0].Date,
            name: data[0].invoice.Sales.Name,
            invoicelabel: data[0].invoice.Label,
            paymentType : paymentType,
            creditAmount : data[0].invoice.creditAmount,
            cashAmount : data[0].invoice.cashAmount,
            shopName,
            items: data.map(order => ({
                brand: order.IdBrand.Brand,
                boxNumber: order.BoxNumber,
                itemNumber: order.ItemNumber,
                cartonNumber: order.CartonNumber,
                sacNumber: order.SacNumber,
                priceBox: order.IdBrand.Pricebox,
                priceCarton: order.IdBrand.Pricectns,
                priceItem: order.IdBrand.Priceitem,
                priceSac: order.IdBrand.Pricesac,
                totalItemValue: order.Totalitemvalue,
                totalCtnsValue: order.Totalctnsvalue,
                totalBoxValue: order.Totalboxvalue,
                totalSacValue: order.Totalsacvalue,
                totalValue: order.Totalvalue,
            })),
        };
        navigate('/facture', { state: invoiceData });
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
                <TableCell colSpan={6} style={{ fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div>Shop name: {shopName}</div>
                        <div style={{display : 'flex'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateOrder}
                                style={{ margin: '10px 10px 10px 0' }}
                            >
                               Update order
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleViewInvoice}
                                style={{ margin: '10px 10px 10px 0' }}
                            >
                                View Invoice
                            </Button>
                        </div>
                        <div>{data[0].invoice.Label}</div>
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
                                        <TableCell align="center">Sac</TableCell>
                                        <TableCell align="center">Ctns</TableCell>
                                        <TableCell align="center">Pqt</TableCell>
                                        <TableCell align="center">Piece</TableCell>
                                        <TableCell align="center">Sac value</TableCell>
                                        <TableCell align="center">Ctns value</TableCell>
                                        <TableCell align="center">Pqt value</TableCell>
                                        <TableCell align="center">Piece value</TableCell>
                                        <TableCell align="center">Total value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell align="left">{order.IdBrand.Brand}</TableCell>
                                            <TableCell align="center">{order.SacNumber}</TableCell>
                                            <TableCell align="center">{order.CartonNumber}</TableCell>
                                            <TableCell align="center">{order.BoxNumber}</TableCell>
                                            <TableCell align="center">{order.ItemNumber}</TableCell>
                                            <TableCell align="center">{formatter.format(order.Totalsacvalue)}</TableCell>
                                            <TableCell align="center">{formatter.format(order.Totalctnsvalue)}</TableCell>
                                            <TableCell align="center">{formatter.format(order.Totalboxvalue)}</TableCell>
                                            <TableCell align="center">{formatter.format(order.Totalitemvalue)}</TableCell>
                                            <TableCell align="center">{formatter.format(order.Totalvalue)}</TableCell>
                                            <TableCell align="center">
                                                {/* <IconButton onClick={() => editPurchase(order.id)}>
                                                    <EditIcon />
                                                </IconButton> */}
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