import React, {useState, useEffect, useContext} from 'react';
import { Box, TextField } from '@mui/material';
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
import { fetchGoodsLists } from './ApiGoodsList';
import { fetchGoodsCashvanLists } from './ApiGoodsCashvanList';
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
import AddCircle from '@mui/icons-material/AddCircle';
import formaterNombre from '../../formaterNombre';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import {Tabs,Tab} from '@mui/material';

function Goods() {
    const navigate = useNavigate();
    const username1 = useContext(MyContext);
    document.title = "Add a product";
    const [open, setOpen] = useState(false);
    const [goodsLists, setGoodsLists] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [filtername, setFiltername] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('normal_price');
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
      };


    const handleFilterNameChange = (e) => {
        setFiltername(e.target.value);
    };
    const filteredGoodsName = goodsLists.filter((goodlist) =>
        goodlist.brand.toLowerCase().includes(filtername.toLowerCase())
    );
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredGoodsName.length) : 0;
    useEffect(() => {
        setLoading(true);
        if(tabIndex===0){
            fetchGoodsLists()
            .then(data => {
                setGoodsLists(data);
                setLoading(false);
              })
              .catch(error => {
                console.log(error);
              });
        }
        else {
            fetchGoodsCashvanLists()
            .then(data => {
                setGoodsLists(data);
                setLoading(false);
              })
              .catch(error => {
                console.log(error);
              });
        }
        setLoading(false);
      
    }, [tabIndex])
    
    const editGood = (goodId) => {
        navigate(`/good/${goodId}`, { state: { param: goodId }, replace: true });
    }
    
    const addGood = (goodId) => {
        navigate(`/addgood`);
    }

    const handleSelectedPriceChange = (event) => {
        setSelectedPrice(event.target.value);
      };

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
                axios.delete(`/api/good/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchGoodsLists()
                    .then(data => {
                        setGoodsLists(data);
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
                            <Button variant="contained" endIcon={< AddCircle />} onClick={() => addGood()}>
                                Add a product
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextField 
                                id="goodfilter" 
                                label="Search..." 
                                variant="outlined" 
                                value={filtername} 
                                onChange={handleFilterNameChange} />
                        </Col>
                    </Row>
                    <Row>
                    {/* <FormControl component="fieldset">
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                    Select a Price Type
                                </Typography>
                                <RadioGroup
                                row
                                    aria-label="price"
                                    name="radio-buttons"
                                    value={selectedPrice}
                                    onChange={handleSelectedPriceChange}
                                >
                                    <FormControlLabel
                                    value="normal_price"
                                    control={<Radio />}
                                    label="Normal Price"
                                    />
                                    <FormControlLabel
                                    value="cashvan_price"
                                    control={<Radio />}
                                    label="Cashvan Price"
                                    />
                                </RadioGroup>
                                </FormControl> */}
                        <Tabs 
                            value={tabIndex} 
                            onChange={handleTabChange} 
                            centered 
                            sx={{ mb: 3 }}
                            >
                            <Tab label="Normal Prices" />
                            <Tab label="Cashvan Prices" />
                        </Tabs>
                    </Row>
                    <Row>
                        <Col>
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="City lists">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Brand</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Price/Sac</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Price/Ctn</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Price/Pqt</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Price/Pcs</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Price/Btl</TableCell>
                                         
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredGoodsName
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((goodlist)=>(
                                                <TableRow
                                                    key={goodlist.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                    {goodlist.brand}
                                                    </TableCell>
                                                    <TableCell align="right">{goodlist.pricesac.toLocaleString('en-US')}</TableCell>
                                                    <TableCell align="right">{goodlist.pricectns.toLocaleString('en-US')}</TableCell>
                                                    <TableCell align="right">{goodlist.pricebox.toLocaleString('en-US')}</TableCell>
                                                    <TableCell align="right">{goodlist.priceitem.toLocaleString('en-US')}</TableCell>
                                                    <TableCell align="right">{goodlist.pricebottle.toLocaleString('en-US')}</TableCell>
                                                    <TableCell align="right"><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }}><Fab size="small" color="primary" aria-label="edit"><EditIcon onClick={() => editGood(goodlist.id)} /></Fab></motion.span><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }} style={{ marginLeft: '20px' }}><Fab size="small" color="secondary" aria-label="edit"><DeleteForeverIcon onClick={() => handleDelete(goodlist.id)} /></Fab></motion.span></TableCell>
                                                </TableRow>   
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={filteredGoodsName.length}
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
export default Goods;