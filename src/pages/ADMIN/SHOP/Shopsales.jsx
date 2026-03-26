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
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MyContext from '../../MyContext';
import LayoutAdmin from '../../LayoutAdmin';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';

const ShopRow = ({ shop, editShop, handleDelete, formatter }) => {
    return (
        <TableRow key={shop.s_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align="left"><a href={`/addapurchase/${shop.s_id}/${shop.w_id}`}>{shop.s_Section}</a></TableCell>
            <TableCell align="left">{shop.s_Location}</TableCell>
            <TableCell align="left">{shop.s_ShopName}</TableCell>
            <TableCell align="left">{shop.s_Phone}</TableCell>
            <TableCell align="right">{formatter.format(shop.s_CreditLimit)}</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
        </TableRow>
    );
};

function Shopsales() {
    const formatter = new Intl.NumberFormat('fr-FR');
    document.title = "List of shops";
    const navigate = useNavigate();
    const username1 = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(useParams().id)
    const [shopsalesLists, setShopsalesLists] = useState([]);
    const [salesname, setSalesname] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filtername, setFiltername] = useState('');
    const [filtersection, setFiltersection] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);


    const handleFilterNameChange = (e) => {
        setFiltername(e.target.value);
    };
    const handleFilterSectionChange = (e) => {
        setFiltersection(e.target.value);
    };
    const filteredData = shopsalesLists.filter(item => {
        if (filtername && !item.s_ShopName.toLowerCase().includes(filtername.toLowerCase())) {
            return false;
        }
        if (filtersection && !item.s_Section.toLowerCase().includes(filtersection.toLowerCase())) {
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
        axios.get(`/api/shopsales/${id}`)
        .then(response => {
            setShopsalesLists(response.data);
            setSalesname(response.data[0].w_Name);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
            if (error.response?.status === 404) {
                setIsEmpty(true);
              }
          
          });
          setLoading(false);
    }, [])
    
    const editShop = (shopId) => {
        navigate(`/shop/${shopId}`, { state: { param: shopId }, replace: true });
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
                    fetchShopsLists()
                    .then(data => {
                        setShopsalesLists(data);
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
                            <h3><strong>SALESPERSON</strong> : <font color="#FF0000">{salesname}</font></h3>
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
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>Phone</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Credit Limit</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Total credit</TableCell>
                                            <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>Credit limit remaining</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {isEmpty ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                        Empty shop list
                                                </TableCell>
                                                </TableRow>
                                            ) : (
                                        filteredData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((shopslist)=>(
                                                <ShopRow 
                                                    key={shopslist.s_id}
                                                    shop={shopslist}
                                                    editShop={editShop}
                                                    handleDelete={handleDelete}
                                                    formatter={formatter}
                                                />   
                                            ))
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
export default Shopsales;