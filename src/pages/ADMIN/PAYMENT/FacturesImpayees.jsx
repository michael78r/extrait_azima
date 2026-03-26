import React ,  { useState, useEffect}from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import formatDate from '../../formatDate';
import Typography from '@mui/material/Typography';
import formaterNombre from '../../formaterNombre';

export default function FacturesImpayees({shop,unpaidInvoice,total,index}) {
    const [open, setOpen] = React.useState(false);

    const [countOverdueInvoices, setCountOverdueInvoices] = useState(0);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        unpaidInvoice.forEach((invoice) => {
            const invoiceDate = new Date(invoice.date);
            invoiceDate.setHours(0, 0, 0, 0);
            
            const diffTime = today - invoiceDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            invoice.nbJourD = diffDays;
        });
        

        const count = unpaidInvoice.reduce((count, invoice) => {
            return count + (invoice.nbJourD > shop.CreditDays ? 1 : 0);
        }, 0);

        setCountOverdueInvoices(count);
    },[]);
   
    console.log(unpaidInvoice);
    const formatter = new Intl.NumberFormat('fr-FR');
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ color: countOverdueInvoices > 0 ? 'red' : 'inherit' }}>
                {shop.Section}
                </TableCell>
                <TableCell sx={{ color: countOverdueInvoices > 0 ? 'red' : 'inherit' }}>{shop.Location}</TableCell>
                <TableCell sx={{ color: countOverdueInvoices > 0 ? 'red' : 'inherit' }}>{shop.ShopName}</TableCell>
                <TableCell sx={{ color: countOverdueInvoices > 0 ? 'red' : 'inherit' }}>{shop.Phone}</TableCell>
                <TableCell sx={{ color: countOverdueInvoices > 0 ? 'red' : 'inherit' }}>{formaterNombre(total)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                    UNPAID LIST
                    </Typography>
                        <Table size="small" aria-label="overstays">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }}>Number invoice</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }}>Total amount remaining</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap'}}>Credit days</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap'}}>Remaining days</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unpaidInvoice.map(invoice => (
                            <TableRow key={invoice.id}>
                                <TableCell sx={{ color: invoice.nbJourD > shop.CreditDays ? 'red' : 'inherit' }}>{formatDate(invoice.date)}</TableCell>
                                <TableCell sx={{ color: invoice.nbJourD > shop.CreditDays ? 'red' : 'inherit' }}>{invoice.Label}</TableCell>
                                <TableCell sx={{ color: invoice.nbJourD > shop.CreditDays ? 'red' : 'inherit' }}>{formaterNombre(invoice.restant)}</TableCell>
                                <TableCell sx={{ color: invoice.nbJourD > shop.CreditDays ? 'red' : 'inherit' }}>{shop.CreditDays}</TableCell>
                                <TableCell sx={{ color: invoice.nbJourD > shop.CreditDays ? 'red' : 'inherit' }}>{+shop.CreditDays-invoice.nbJourD}</TableCell>
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
}

 