import React, {useState, useEffect, useContext} from 'react';
import { Box, Tooltip } from '@mui/material';
import { Container, Row, Col } from 'react-grid-system';
import axios from 'axios';
import Swal from 'sweetalert2';
import PaginationTable from '../../PaginationTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchShopPayments } from './ApiShopPayments';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import {motion} from "framer-motion";
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MyContext from '../../MyContext';
import LayoutAdmin from '../../LayoutAdmin';
import AddCircle from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import formaterNombre from '../../formaterNombre';


const ShopRow = ({ shop, editShop, handleDelete, formatter, paidShop }) => {
    const getTotalCash = (payments) => {
        return payments.reduce((acc, payment) => acc + Number(payment.Cash), 0);
    };

    const getTotalInvoice = (invoices) => {
        return invoices.reduce((acc, invoice) => acc + Number(invoice.Amount), 0);
    };

    const calculatecredit = (payments, invoices) => {
        const totalCash = getTotalCash(payments);
        const totalInvoice = getTotalInvoice(invoices);
        const credit = totalCash - totalInvoice;
        return credit < 0 ? -credit : 0;
    };

    const creditremaining = shop.CreditLimit - calculatecredit(shop.payments, shop.invoices);

    return (
       
        <TableRow key={shop.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
             <Tooltip title={shop.longitude +" - "+ shop.latitude}>
            <TableCell align="left">{shop.Section}</TableCell>
            </Tooltip>
            <TableCell align="left">{shop.Location}</TableCell>
            <TableCell align="left">{shop.ShopName}</TableCell>
            <TableCell align="left">{shop.nameManagerShop}</TableCell>
            <TableCell align="left">{shop.Phone}</TableCell>
            <TableCell align="right">{formaterNombre(shop.CreditLimit)}</TableCell>
            <TableCell align="right">{formaterNombre(getTotalInvoice(shop.invoices))}</TableCell>
            <TableCell align="right">{formaterNombre(calculatecredit(shop.payments, shop.invoices))}</TableCell>
            <TableCell align="right" style={{ color: creditremaining < 0 ? "red" : "blue" }}>{formaterNombre(creditremaining)}</TableCell>
            <TableCell align="right" >{shop.CreditDays}</TableCell>
            {/* <TableCell align="right" style={{ color: netCreditColor }}>{formatter.format(netCredit)}</TableCell>
            <TableCell align="right" style={{ color: remainingCreditColor }}>{formatter.format(remainingCredit)}</TableCell> */}
            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>
                <motion.span initial={{ scale: 1 }} whileHover={{ scale: 1.2 }} style={{ marginLeft: '20px' }}>
                    <Fab size="small" color="primary" aria-label="paid">
                        <PaidIcon onClick={() => paidShop(shop.id)} />
                    </Fab>
                </motion.span>
                <motion.span initial={{ scale: 1 }} whileHover={{ scale: 1.2 }} style={{ marginLeft: '20px' }}>
                    <Fab size="small" color="primary" aria-label="edit">
                        <EditIcon onClick={() => editShop(shop.id)} />
                    </Fab>
                </motion.span>
                <motion.span initial={{ scale: 1 }} whileHover={{ scale: 1.2 }} style={{ marginLeft: '20px' }}>
                    <Fab size="small" color="secondary" aria-label="delete">
                        <DeleteForeverIcon onClick={() => handleDelete(shop.id)} />
                    </Fab>
                </motion.span>
            </TableCell>
        </TableRow>
       
    );
};

function Shops() {
    document.title = "Shops";
    const formatter = new Intl.NumberFormat('fr-FR');
    const navigate = useNavigate();
    const username1 = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [shopsLists, setShopsLists] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filtername, setFiltername] = useState('');
    const [filtersection, setFiltersection] = useState('');
    const handleFilterNameChange = (e) => {
        setFiltername(e.target.value);
    };
    const handleFilterSectionChange = (e) => {
        setFiltersection(e.target.value);
    };
    const filteredData = shopsLists.filter(item => {
        if (filtername && !item.ShopName.toLowerCase().includes(filtername.toLowerCase())) {
          return false;
        }  
        if (filtersection && !item.Section.toLowerCase().includes(filtersection.toLowerCase())) {
            return false;
        }
        return true;
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;
    useEffect(() => {
        setLoading(true);
        fetchShopPayments()
        .then(data => {
            setShopsLists(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, [])

    const paidShop = (shopId) => {
        navigate(`/paidshop/${shopId}`, { state: { param: shopId }, replace: true });
    }
    
    const editShop = (shopId) => {
        navigate(`/shop/${shopId}`, { state: { param: shopId }, replace: true });
    }
    
    const addShop = (shopId) => {
        navigate(`/addShop`);
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You cannot undo this action !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it !'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/shop/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    // fetchShopsLists()
                    .then(data => {
                        setShopsLists(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })
                .catch(function (error) {
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'An Error Occured!',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // })
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    navigate(`/shops`);
                });
            }
        })
    }

    return (
        <LayoutAdmin>
            <Box
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, flexGrow: 1 }}
                noValidate
                autoComplete="off"
            >
                {loading ? (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open="true"
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                ) : (
                <Container>
                    <Row>
                        <Col>
                            <Button variant="contained" endIcon={< AddCircle />} onClick={() => addShop()}>
                                Add a shop
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextField 
                                size="small"
                                id="sectionfilter" 
                                label="Search section..." 
                                variant="outlined" 
                                value={filtersection} 
                                onChange={handleFilterSectionChange} 
                            />
                        </Col>
                        <Col>
                            <TextField 
                                size="small"
                                id="namefilter" 
                                label="Search shop name..." 
                                variant="outlined" 
                                value={filtername} 
                                onChange={handleFilterNameChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="City lists">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Section</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Shop name</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Name of manager shop</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Phone</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Credit Limit</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Total invoice</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Total credit</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Credit remaining</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Credit days</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap', minWidth: 200 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((shopslist)=>(
                                                <ShopRow 
                                                    key={shopslist.id}
                                                    shop={shopslist}
                                                    editShop={editShop}
                                                    handleDelete={handleDelete}
                                                    paidShop={paidShop}
                                                    formatter={formatter}
                                                /> 
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={PaginationTable}
                            />
                        </Col>
                    </Row>
                </Container>
                )}
            </Box>
        </LayoutAdmin>
    );
}  
export default Shops;