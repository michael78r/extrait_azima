import React, { useState, useEffect, useContext } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, Typography, TablePagination, Backdrop, CircularProgress } from '@mui/material';
import { Container, Row, Col } from 'react-grid-system';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import MyContext from '../../MyContext';
import LayoutAdmin from '../../LayoutAdmin';
import { format, parseISO } from 'date-fns';
import { fetchPurchaseLists } from './ApiPurchaseLists';
import PaginationTable from '../../PaginationTable';
import DailyOrder from './DailyOrder'; // Import the new DailyOrder component
import TextField from '@mui/material/TextField';

function Purchase() {
    const navigate = useNavigate();
    document.title = "Orders";
    const formatter = new Intl.NumberFormat('fr-FR');
    const username1 = useContext(MyContext);
    const [purchaseLists, setPurchaseLists] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(false);
    const [filterDate1, setFilterDate1] = useState('');
    const [filterDate2, setFilterDate2] = useState('');

    const handleFilterDate1Change = (e) => {
        setFilterDate1(e.target.value);
      };
      const handleFilterDate2Change = (e) => {
        setFilterDate2(e.target.value);
      };

    useEffect(() => {
        setLoading(true);
        fetchPurchaseLists()
            .then(data => {
                setPurchaseLists(data);
                groupByDateSalespersonShop(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const groupByDateSalespersonShop = (data) => {
        const grouped = data.reduce((acc, curr) => {
            const date = format(parseISO(curr.invoice.date), 'dd-MM-yyyy');
            const salesname = curr.invoice.Sales.Name;
            const shopName = curr.invoice.Shop.ShopName;
            const purchaseId = curr.id;
            const brand = curr.IdBrand.Brand;
      
    
            if (!acc[date]) {
                acc[date] = {};
            }
            if (!acc[date][salesname]) {
                acc[date][salesname] = {};
            }
            if (!acc[date][salesname][shopName]) {
                acc[date][salesname][shopName] = [];
            }
            
            if (!acc[date][salesname][shopName]) {
                acc[date][salesname][shopName] = [];
            }
    
            acc[date][salesname][shopName].push({
                ...curr,
                Date: date,
                DateTime: format(parseISO(curr.invoice.date), 'HH:mm:ss'),
            });
        
            // console.log(acc);
            
            return acc;
        }, {});

        setGroupedData(grouped);
    };
  

    const filterGroupedByDate = (groupedData, startDate, endDate) => {
        const filteredGrouped = Object.keys(groupedData).reduce((acc, date) => {
            const currentDate = new Date(date.split('-').reverse().join('-'));
          
        if ((!startDate || startDate.trim() === '') && (!endDate || endDate.trim() === '')) {
            acc[date] = groupedData[date];
        } else if (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
            acc[date] = groupedData[date];
        }
            return acc;
        }, {});
    
        return filteredGrouped;
    };
    
    const filteredGrouped = filterGroupedByDate(groupedData, filterDate1, filterDate2);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const editPurchase = (purchaseId) => {
        navigate(`/editpurchase/${purchaseId}`, { state: { param: purchaseId }, replace: true });
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/purchase/${id}`)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        fetchPurchaseLists()
                            .then(data => {
                                setPurchaseLists(data);
                                groupByDateSalespersonShop(data);
                                setLoading(false);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occurred!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    });
            }
        })
    }

    return (
        <LayoutAdmin>
            <Container>
                <Row>
                    <Col>
                        <Typography variant="h4" gutterBottom>
                            List of orders
                        </Typography>
                        {loading ? (
                            <Backdrop open={loading}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        ) : (
                            <>
                            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Filter: 
                            </Typography>
                            <TextField
                                      size="small"
                                      variant="outlined"
                                      fullWidth
                                      type="date"
                                      value={filterDate1}
                                      onChange={handleFilterDate1Change}
                                      sx={{ mb: 3 ,width: '100x' }}
                                      InputLabelProps={{ shrink: true }}
                                      required
                                  />
                               <TextField
                                      size="small"
                                      variant="outlined"
                                      fullWidth
                                      type="date"
                                      value={filterDate2}
                                      onChange={handleFilterDate2Change}
                                      sx={{ mb: 3 ,width: '100x' }}
                                      InputLabelProps={{ shrink: true }}
                                      required
                                />
                                 
                              </Box>   
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell><Typography variant="h6" style={{ fontWeight: 'bold', color: 'red' }}>Date of order</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(filteredGrouped)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map(date => (
                                            <DailyOrder
                                                key={date}
                                                date={date}
                                                data={filteredGrouped[date]}
                                                formatter={formatter}
                                                editPurchase={editPurchase}
                                                handleDelete={handleDelete}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]} // Options de lignes par page
                                component="div"
                                count={Object.keys(filteredGrouped).length} // Nombre total de lignes
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage} // Mise à jour de la page
                                onRowsPerPageChange={handleChangeRowsPerPage} // Mise à jour des lignes par page
                            />
                            </>
                        )}
                    </Col>
                </Row>
               
            </Container>
        </LayoutAdmin>
    );
}

export default Purchase;