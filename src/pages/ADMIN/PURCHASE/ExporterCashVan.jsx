import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import AmountInWords from '../../AmountInWords';
import { useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import formaterNombre from '../../formaterNombre';

const ExporterCashVan = () => {
    const formatter = new Intl.NumberFormat('fr-FR');
    const { state } = useLocation();
    const { date, name, invoicelabel, shopName, items } = state;

    const navigate = useNavigate();
    const invoiceRef = useRef();
    let lineNumber = 1;

    useEffect(() => {
        console.log(items);
    }, [])

    const generatePdf = async () => {
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');
    };


    const totalSum = items.reduce((acc, item) => acc + Number(item.totalValue), 0);

    return (
        <div>
            <div ref={invoiceRef} style={{ padding: '50px' }}>
                <center style={{ fontWeight: 'bold' }}>BON DE LIVRAISON<br /><br /></center>
                <TableContainer component={Paper}>
                    <Table sx={{
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                            border: '1px solid',
                            verticalAlign: 'top',
                            padding: '5px',
                        },
                    }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell rowSpan={1} colSpan={2} style={{ whiteSpace: 'nowrap' }}>
                                    <strong>CASH VAN</strong><br />
                                    <br />
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Invoice No.<br /><strong>{invoicelabel}</strong></TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Dated<br /><strong>{date}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'nowrap' }} rowSpan={2} colSpan={2}>
                                    <strong>{shopName}</strong><br/>
                                    {name}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} style={{ paddingBottom: '50px' }}>Terms of Delivery</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ width: '5%', fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'left' }}>Description of Goods</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Pkgs</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Rate</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                            </TableRow>
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    {+item.sacNumber !== 0 && +item.priceSac !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>{lineNumber++}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>Sac</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.sacNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceSac)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalSacValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.cartonNumber !== 0 && +item.priceCarton !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>{lineNumber++}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>Ctn</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.cartonNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceCarton)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalCtnsValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.boxNumber !== 0 && +item.priceBox !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>{lineNumber++}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>Pqt</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.boxNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceBox)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalBoxValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.itemNumber !== 0 && +item.priceItem !== 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>{lineNumber++}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>Piece</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.itemNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceItem)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalItemValue)}</TableCell>                                    
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                            
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{textAlign: 'right', fontWeight: 'bold'}}>Total</TableCell>
                                <TableCell colSpan={3}></TableCell>
                                <TableCell style={{ textAlign: 'right', fontWeight: 'bold' }}>Ar {formaterNombre(totalSum)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table sx={{
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                            border: '1px solid',
                            verticalAlign: 'top',
                            padding: '5px',
                        },
                    }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell width='50%'>Declaration<br/>We declare that this invoice shows the actual price
                                of the goods described and that all particulars are true and correct.</TableCell>
                               
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <p style={{textAlign: 'center'}}>This is a Computer Generated Invoice</p>
            </div>
            <center>
                <Button variant="outlined" onClick={generatePdf}>Export PDF</Button>
            </center>
            <br /><br />
         
        </div>
    );
};

export default ExporterCashVan;