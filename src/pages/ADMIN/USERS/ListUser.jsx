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
import { fetchUsersLists } from './ApiUsersList';
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

function ListUser() {
    document.title = "List users";
    const navigate = useNavigate();
    const username1 = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [usersList, setUsersLists] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersList.length) : 0;
    useEffect(() => {
        setLoading(true);
        fetchUsersLists()
        .then(data => {
            setUsersLists(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, [])
    

    const titleStyle = {
        color: '#1769aa',
        padding: '20px',
    };
    const styleCity = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    
    const editUser = (username) => {
        navigate(`/user/${username}`, { state: { param: username }, replace: true });
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
                axios.delete(`/api/user/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchUsersLists()
                    .then(data => {
                        setUsersLists(data);
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
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="City lists" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>User name</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Roles</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Contact</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Email</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {usersList
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user)=>(
                                                <TableRow
                                                    key={user.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                    {user.username}
                                                    </TableCell>
                                                    <TableCell>
                                                    {user.roles.length === 2 
                                                        ? `${user.roles[0]}, ${user.roles[1]}` 
                                                        : user.roles[0]}
                                                    </TableCell>
                                                    <TableCell>{user.contact}</TableCell>
                                                    <TableCell>{user.Email}</TableCell>
                                                    <TableCell align="right"><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }}><Fab size="small" color="primary" aria-label="edit"><EditIcon onClick={() => editUser(user.username)} /></Fab></motion.span></TableCell>
                                                </TableRow>   
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={usersList.length}
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
export default ListUser;