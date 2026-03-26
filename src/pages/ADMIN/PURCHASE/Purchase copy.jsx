import React, {useState, useEffect, useContext} from 'react';
import { Box } from '@mui/material';
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
import { fetchPurchaseLists } from './ApiPurchaseLists';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {motion} from "framer-motion";
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MyContext from '../../MyContext';
import LayoutAdmin from '../../LayoutAdmin';
import { format, parseISO } from 'date-fns';
import AddCircle from '@mui/icons-material/AddCircle';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExporterFacture from './ExporterFacture';

function DailyOrder({ mypurchase, formatter }) {
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
                >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>{mypurchase.Date}</TableCell>
            {/* <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>{formatDateWithDateFns(mypurchase.Date)}</TableCell> */}
            <TableCell align="left">{mypurchase.idsales.Name}</TableCell>
            <TableCell align="left">{mypurchase.IdShop.ShopName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  List of order
                </Typography>
                <Table size="small" aria-label="purchases">
                    {/* <TableHead>
                        <TableRow>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Brand</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Item/box order</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Carton order</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Item/box value (MGA)</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Carton value (MGA)</TableCell>
                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Total value (MGA)</TableCell>
                            <TableCell align="center" style={{ whiteSpace: 'nowrap', minWidth: 200 }}>Action</TableCell>
                        </TableRow>
                    </TableHead> */}
                    <TableBody>
                        <TableRow key={mypurchase.id}>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>{mypurchase.DateTime}</TableCell>
                            <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>{mypurchase.IdBrand.Brand}</TableCell>
                            <TableCell align="right">{formatter.format(mypurchase.ItemNumber)}</TableCell>
                            <TableCell align="right">{formatter.format(mypurchase.CartonNumber)}</TableCell>
                            <TableCell align="right">{formatter.format(mypurchase.Totalitemvalue)}</TableCell>
                            <TableCell align="right">{formatter.format(mypurchase.Totalctnsvalue)}</TableCell>
                            <TableCell align="right">{formatter.format(mypurchase.Totalvalue)}</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
}

function Purchase() {
    const navigate = useNavigate();
    const formatter = new Intl.NumberFormat('fr-FR');
    const username1 = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [purchaseLists, setPurchaseLists] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [groupedData, setGroupedData] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - purchaseLists.length) : 0;
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
    }, [])

    const groupByDateSalespersonShop = (data) => {
        const grouped = data.reduce((acc, curr) => {
            const date = format(parseISO(curr.Date), 'dd-MM-yyyy');
            const time = format(parseISO(curr.Date), 'HH:mm:ss');
            const salesperson = curr.idsales.Name;
            const shopName = curr.IdShop.ShopName;
            const key = `${date}_${salesperson}_${shopName}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({ ...curr, Date: date, DateTime: time });
            return acc;
        }, {});
        setGroupedData(grouped);
    };

    const editPurchase = (purchaseId, salesId) => {
        navigate(`/editpurchase/${purchaseId}/${salesId}`, { state: { param: purchaseId }, replace: true });
    }
    
    const addPurchase = (purchaseId, salesId) => {
        navigate(`/addPurchase`);
    }

    const handleDelete = (id, salesid) => {
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
                axios.delete(`/api/purchase/${id}/${salesid}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchPurchaseLists()
                    .then(data => {
                        setPurchaseLists(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'An Error Occured!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                });
            }
        })
    }

    const formatDateWithDateFns = (isoDate) => {
        const date = parseISO(isoDate);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    };

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
                  open={true}
              >
                  <CircularProgress color="inherit" />
              </Backdrop>
              ) : (
              <Container>
                  {/* <Row>
                      <Col>
                          <Button variant="contained" endIcon={< AddCircle />} onClick={() => addShop()}>
                              Add a shop
                          </Button>
                      </Col>
                  </Row> */}
                  <Row>
                      <Col>
                          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                              <Table sx={{ minWidth: 650 }} size="small" aria-label="City lists">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Salesperson</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Shop name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(groupedData).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(key => (
                                            <React.Fragment key={key}>
                                                {groupedData[key].map((mypurchase, index) => (
                                                    <DailyOrder key={mypurchase.id + index} mypurchase={mypurchase} formatter={formatter} />
                                                ))}
                                            </React.Fragment>
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
                                count={Object.keys(groupedData).length}
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
export default Purchase;