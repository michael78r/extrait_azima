import React , { useState, useEffect}from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import FacturesImpayees from './FacturesImpayees';
import TablePagination from '@mui/material/TablePagination';
import formaterNombre from '../../formaterNombre';
export default function UnpaidTabs(props) {
  const { children, value, index, shops,onTotalCountOverdueInvoices, ...other } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const calculateImpayees = (invoices,payments) => {
    const sortedFactures = [...invoices].sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedPaiements = [...payments].sort((a, b) => new Date(a.date) - new Date(b.date));
    let totalPaiements = 0;
    sortedPaiements.forEach(paiement => {
      totalPaiements += parseInt(paiement.Cash);
    });
    let factureImpayees = [];
    
    sortedFactures.forEach(facture => {
      if (totalPaiements >= parseInt(facture.Amount)) {
        totalPaiements -= parseInt(facture.Amount);
      } else {
        factureImpayees.push({
          ...facture,
          restant: parseInt(facture.Amount) - parseInt(totalPaiements),
        });
        totalPaiements = 0; 
      }
    });
    return factureImpayees;
}; 

  const calculerSommeFacturesImpayees = (data) =>{
    return data.reduce((total, item) => total + parseFloat(item.restant), 0);
  };

const shopsFiltered = shops.filter(shop => {
    const impayees = calculateImpayees(shop.invoices, shop.payments);
    const total = calculerSommeFacturesImpayees(impayees); 
    return total > 0; 
});
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shopsFiltered.length) : 0;

const invoices = [];
let count = 0;
shopsFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach(shop => {
      const unpaidInvoice = calculateImpayees(shop.invoices, shop.payments);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      unpaidInvoice.forEach((invoice) => {
          const invoiceDate = new Date(invoice.date);
          invoiceDate.setHours(0, 0, 0, 0);
          const diffTime = today - invoiceDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          invoice.nbJourD = diffDays;
          if (diffDays > shop.CreditDays) {
              count++;
          }
      });

      invoices.push(...unpaidInvoice); 
  });
  onTotalCountOverdueInvoices(count);


 
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
            <Table sx={{ minWidth: 650 }} aria-label="Shop lists">
                <TableHead>
                    <TableRow>
                      <TableCell></TableCell>   
                      <TableCell style={{ whiteSpace: 'nowrap' }}>Section</TableCell>
                      <TableCell style={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                      <TableCell style={{ whiteSpace: 'nowrap' }}>Shop name</TableCell>
                      <TableCell style={{ whiteSpace: 'nowrap' }}>Phone</TableCell>
                      <TableCell style={{ whiteSpace: 'nowrap' }}>Total factures reste a payes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {shopsFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(shop => (
                      <FacturesImpayees
                      shop={shop}
                      unpaidInvoice ={ calculateImpayees(shop.invoices,shop.payments)}
                      total={calculerSommeFacturesImpayees(calculateImpayees(shop.invoices,shop.payments))}
                      />
                  ))}
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
   count={shopsFiltered.length}
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
  