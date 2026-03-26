import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import AmountInWords from '../../AmountInWords';
import { useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';

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

const ExporterFacture = () => {
    const formatter = new Intl.NumberFormat('fr-FR');
    const { state } = useLocation();
    const { date, name, invoicelabel, shopName, items } = state;
    const [remarks, setRemarks] = useState('');
    const invoiceRef = useRef();

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
                                <TableCell rowSpan={3} colSpan={2} style={{ whiteSpace: 'nowrap' }}>
                                    <strong>Societe Azima Sarl - (FY 2024)</strong><br />
                                    LOT 06 F 160 MAHAZOARIVO SUD ANSIRABE I<br />
                                    Madagascar<br />
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={4}>Invoice No.<br /><strong>{invoicelabel}</strong></TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={4}>Dated<br /><strong>{date}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>Delivery Note</TableCell>
                                <TableCell colSpan={4}>Mode/Terms of Payment</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>Reference No. & Date</TableCell>
                                <TableCell colSpan={4}>Other References</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'nowrap' }} rowSpan={4} colSpan={2}>Buyer (Bill to)<br/>
                                    <strong>{shopName}</strong><br/>
                                    {name}
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={4}>Buyer's Order No.</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={4}>Dated</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>Dispatch Doc No.</TableCell>
                                <TableCell colSpan={4}>Delivery Note Date</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>Dispatched through</TableCell>
                                <TableCell colSpan={4}>Destination</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={8} style={{ paddingBottom: '50px' }}>Terms of Delivery</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell rowSpan={2} style={{ width: '5%', fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
                                <TableCell rowSpan={2} style={{ fontWeight: 'bold', textAlign: 'center' }}>Description of Goods</TableCell>
                                <TableCell colSpan={2} style={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell>
                                <TableCell colSpan={2} style={{ fontWeight: 'bold', textAlign: 'center' }}>Rate</TableCell>
                                <TableCell colSpan={2} style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                                <TableCell rowSpan={2} colSpan={2} style={{ fontWeight: 'bold', textAlign: 'center' }}>Total amount</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>Packet</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Ctns</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Packet</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Ctns</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Packet</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Ctns</TableCell>
                            </TableRow>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center' }}>{index + 1}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>{item.brand}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.itemNumber)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.cartonNumber)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceBox)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.priceCarton)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalItemValue)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalCtnsValue)}</TableCell>
                                    <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>{formaterNombre(item.totalValue)}</TableCell>
                                </TableRow>
                            ))}
                            
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{textAlign: 'right', fontWeight: 'bold'}}>Total</TableCell>
                                <TableCell colSpan={6}></TableCell>
                                <TableCell colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Ar {formaterNombre(totalSum)}</TableCell>
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
                                <TableCell colSpan={2} style={{ paddingBottom: '100px' }}>Amount Chargeable (in words)
                                    <AmountInWords amount={totalSum} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Remarks: <br />{ remarks }</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width='50%'>Declaration<br/>We declare that this invoice shows the actual price
                                of the goods described and that all particulars are true and correct.</TableCell>
                                <TableCell width='50%'><p style={{ textAlign: 'right' }}><strong>for Societe Azima Sarl - (FY 2024)</strong></p>
                                            <p style={{ verticalAlign: 'bottom', textAlign: 'right' }}>Authorised Signatory</p></TableCell>
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
            <center>
                <TextField id="remarks" label="Remarks" variant="outlined" name="remarks" 
                    onChange={(event)=>{setRemarks(event.target.value)}} value={remarks}
                />
            </center>
        </div>
    );
};

export default ExporterFacture;