import React, { useRef } from 'react';
import { Preview, print } from 'react-html2pdf';
import Button from '@mui/material/Button';
import AmountInWords from '../../AmountInWords';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const ExporterFacture = ({ Location, ShopName, Section, Phone }) => {
    return (
        <div>
            <div>
                <Preview id={'jsx-template'} >
                <div style={{ margin: '50px' }}>
                    <center>BON DE LIVRAISON</center>
                <TableContainer>
                    <Table sx={{
                            minWidth: 650,
                            '& .MuiTableCell-root': {
                                border: '1px solid',
                                verticalAlign: 'top',
                            },
                        }} 
                    aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell rowSpan={3} colSpan={2} style={{ whiteSpace: 'nowrap' }}>
                                    <strong>Societe Azima Sarl - (FY 2024)</strong><br />
                                    LOT 06 F 160 MAHAZOARIVO SUD ANSIRABE I<br />
                                    Madagascar<br />
                                    NIF: 3002271240<br />
                                    STAT: 46101 12 2016 000420<br />
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Invoice No.</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Dated</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Delivery Note</TableCell>
                                <TableCell colSpan={2}>Mode/Terms of Payment</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Reference No. & Date</TableCell>
                                <TableCell colSpan={2}>Other References</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'nowrap' }} rowSpan={4} colSpan={2}>Buyer (Bill to)<br/>
                                    <strong>{Location} - {ShopName}</strong><br/>
                                    {Section}<br/>
                                    {Phone}<br/>
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Buyer's Order No.</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Dated</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Dispatch Doc No.</TableCell>
                                <TableCell colSpan={2}>Delivery Note Date</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Dispatched through</TableCell>
                                <TableCell colSpan={2}>Destination</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4}>Terms of Delivery</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ width: '5%', fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Description of Goods</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Rate</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>per</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>1</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>Benny (8 Pqt)</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>10</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>11 488</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>Box</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>114 880</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>1</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none' }}>Benny (8 Pqt)</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>10</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>91 900</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>Carton</TableCell>
                                <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right' }}>919 000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{textAlign: 'right'}}>Total</TableCell>
                                <TableCell colSpan={3}></TableCell>
                                <TableCell style={{ textAlign: 'right' }}>Ar 1 033 880</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table sx={{
                            minWidth: 650,
                            '& .MuiTableCell-root': {
                                border: '1px solid',
                                verticalAlign: 'top',
                            },
                        }} 
                    aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2}>Amount Chargeable (in words)
                                    <AmountInWords amount={1033880} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2} height="12%"></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Remarks: <br/>STHELA</TableCell>
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
                </Preview>
                <center><Button variant="outlined" onClick={()=>print('invoice', 'jsx-template')}>Exporter facture</Button></center>
            </div>
        </div>
    );
};

export default ExporterFacture;