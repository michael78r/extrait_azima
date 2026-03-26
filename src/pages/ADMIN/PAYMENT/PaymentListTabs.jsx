import React ,  { useState, useEffect}from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import formatDate from '../../formatDate';
import TablePagination from '@mui/material/TablePagination';
import formaterNombre from '../../formaterNombre';
export default function PaimenentListTabs(props) {
    const { children, value, index, payments, ...other } = props;
    const formatter = new Intl.NumberFormat('fr-FR');
    const sortedPayments = [...payments].sort((a, b) => new Date(a.date) - new Date(b.date));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

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
       <Table sx={{ minWidth: 650 }} aria-label="Payments lists">
           <TableHead>
               <TableRow>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Section</TableCell>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Shop name</TableCell>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Phone</TableCell>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                   <TableCell style={{ whiteSpace: 'nowrap' }}>Total Cash</TableCell>
               </TableRow>
           </TableHead>
           <TableBody>
               {sortedPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payement)=>(
                       <TableRow
                           key={payement.id}
                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                       >
                           <TableCell>{payement.Shop.Section}</TableCell>
                           <TableCell>{payement.Shop.Location}</TableCell>
                           <TableCell>{payement.Shop.ShopName}</TableCell>
                           <TableCell>{payement.Shop.Phone}</TableCell>
                           <TableCell>{formatDate(payement.date)}</TableCell>
                           <TableCell>{formaterNombre(payement.Cash)}</TableCell>
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
   count={payments.length}
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