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
import { Typography} from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {motion} from "framer-motion";
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LayoutAdmin from '../../LayoutAdmin';

function Promotion() {
    document.title = "List promotions";
    const navigate = useNavigate();
    const [promotionList, setPromotionLists] = useState([]);
    
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/promotions`)
        .then(data => {
            setPromotionLists(data.data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, [])
    

    
    
    

    const annulerPromotion = (id) => {
        Swal.fire({
            title: 'Are you sure to undo this promotion?',
            text: "You cannot undo this action !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it !'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.get(`/api/promotion/annuler/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    
                    axios.get(`/api/promotions`)
                    .then(data => {
                        setPromotionLists(data.data);
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
                        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        List of promotions
                        </Typography>
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="City lists" size="small">
                                <TableHead>
                                        <TableRow sx={{ fontSize : '21px'}}>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}  colSpan={2}>
                                                BUY   
                                            </TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}  colSpan={2}>
                                                FREE   
                                            </TableCell>
                                        </TableRow>
                                </TableHead>                   
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Brand</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Quantity</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Brand</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Quantity</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Start date</TableCell>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>End date </TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {promotionList
                                            .map((promotion)=>(
                                                <TableRow
                                                    key={promotion.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                    {promotion.good}
                                                    </TableCell>
                                                    <TableCell>
                                                    {promotion.numberProductRequired } {promotion.unite } 
                                                    </TableCell>
                                                    <TableCell>{promotion.goodFree}</TableCell>
                                                    <TableCell>{promotion.numberProductFree} {promotion.uniteFree} </TableCell>
                                                    <TableCell>{promotion.date}</TableCell>
                                                    <TableCell>{promotion.dateFin}</TableCell>
                                                    <TableCell align="right"><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }}><Fab size="small" color="primary" aria-label="delete"><DeleteForeverIcon onClick={() => annulerPromotion(promotion.id)} /></Fab></motion.span></TableCell>
                                                </TableRow>   
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                        </Col>
                    </Row>
                </Container>
                )}
            </Box>
        </LayoutAdmin>

    );
}  
export default Promotion;