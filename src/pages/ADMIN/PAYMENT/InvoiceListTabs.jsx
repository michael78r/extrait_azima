import React ,  { useState, useEffect}from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import formatDate from '../../formatDate';
import TablePagination from '@mui/material/TablePagination';
import formaterNombre from '../../formaterNombre';
export default function InvoiceListTabs(props) {
    const { children, value, index, invoices, ...other } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoices.length) : 0;

    const sortedInvoices = [...invoices].sort((a, b) => new Date(a.date) - new Date(b.date));
    const formatter = new Intl.NumberFormat('fr-FR');
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {value === index && 
        <>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table sx={{ minWidth: 650 }} aria-label="Invoice lists">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Section</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Shop name</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Phone</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Number invoice</TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap' }}>Total amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice)=>(
                            <TableRow
                                key={invoice.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{invoice.Shop.Section}</TableCell>
                                <TableCell>{invoice.Shop.Location}</TableCell>
                                <TableCell>{invoice.Shop.ShopName}</TableCell>
                                <TableCell>0{invoice.Shop.Phone}</TableCell>
                                <TableCell>{invoice.Sales.Name}</TableCell>
                                <TableCell>{formatDate(invoice.date)}</TableCell>
                                <TableCell>{invoice.Label}</TableCell>
                                <TableCell>{formaterNombre(invoice.Amount)}</TableCell>
                            </TableRow>   
                        )
                    )}      
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}        
                </TableBody>
            </Table>
        </TableContainer>

         <TablePagination
         rowsPerPageOptions={[5, 10, 25, 100]}
         component="div"
         count={invoices.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
       />
       </>
        }
      </div>
    );
  }