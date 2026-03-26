import React, {useState, useEffect, useContext} from 'react';
import { Box } from '@mui/material';
import { Container, Row, Col } from 'react-grid-system';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';
import PaginationTable from '../../../PaginationTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchListeLocalisations } from './ApiListeLocalisations';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {motion} from "framer-motion";
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MyContext from '../../../MyContext';

function Localisations() {
    const navigate = useNavigate();
    const [listeLocalisations, setListeLocalisations] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const username1 = useContext(MyContext);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listeLocalisations.length) : 0;
    useEffect(() => {
        setLoading(true);
        fetchListeLocalisations()
        .then(data => {
            setListeLocalisations(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, [])
    
    const [region, setRegion] = useState('')
    const [pays, setPays] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const titleStyle = {
        color: '#1769aa',
        padding: '20px',
    };
    const styleUnite = {
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
    
    const modifLocalisation = (itemId) => {
        navigate(`/localisation/${itemId}`, { state: { param: itemId }, replace: true });
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Vous êtes sur?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimez-le !'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/localisation/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Supprimé avec succès!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchListeLocalisations()
                    .then(data => {
                        setListeLocalisations(data);
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

    const handleSave = () => {
        if (region.trim() === '' || region.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Le region ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (pays.trim() === '' || pays.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Le pays ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        setLoading(true);
        setIsSaving(true);
        let formData = new FormData()
        formData.append("region", region)
        formData.append("pays", pays)
        formData.append("utilisateur", username1)
        axios.post('/api/ajoutlocalisation', formData)
          .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Ajouté avec succès!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            fetchListeLocalisations()
            .then(data => {
                setListeLocalisations(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
            setRegion('')
            setPays('')
        })
        .catch(function (error) {
        Swal.fire({
            icon: 'error',
            title: 'Il y a une erreur! Veuillez verifier vos données!',
            showConfirmButton: true
        })
        setIsSaving(false)
        setLoading(false);
        });
    }

    return (
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
                        <Col sm={12} className="d-flex justify-content-left align-items-left">
                        <form>
                            <Row>
                                <div className="form-group">
                                    <TextField id="region" label="Region" variant="outlined" name="region" 
                                    onChange={(event)=>{setRegion(event.target.value)}}
                                    value={region} />
                                </div>
                                <div className="form-group">
                                    <TextField id="pays" label="Pays" variant="outlined" name="pays" 
                                    onChange={(event)=>{setPays(event.target.value)}}
                                    value={pays} />
                                </div>
                            </Row>
                            <Row>
                            <Col sm={12} className="d-flex justify-content-left align-items-left">
                                <Button 
                                    sx={{ m: 1, minWidth: 120 }}
                                    disabled={isSaving}
                                    onClick={handleSave} 
                                    type="button"
                                    className="btn btn-outline-primary mt-3"
                                    variant="outlined">
                                    Enregistrer
                                </Button>
                            </Col>
                            </Row>
                        </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="liste des Localisations">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Region</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Pays</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Dernière mise à jour</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Modifié par</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listeLocalisations
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((listeLocalisation)=>(
                                                <TableRow
                                                    key={listeLocalisation.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                    {listeLocalisation.region}
                                                    </TableCell>
                                                    <TableCell align="right">{listeLocalisation.pays}</TableCell>
                                                    <TableCell align="right">{listeLocalisation.maj}</TableCell>
                                                    <TableCell align="right">{listeLocalisation.modifiepar}</TableCell>
                                                    <TableCell><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }} style={{ float: 'left' }}><Fab color="primary" aria-label="edit"><EditIcon onClick={() => modifLocalisation(listeLocalisation.id)} /></Fab></motion.span><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }} style={{ float: 'right' }}><Fab color="secondary" aria-label="edit"><DeleteForeverIcon onClick={() => handleDelete(listeLocalisation.id)} /></Fab></motion.span></TableCell>
                                                </TableRow>   
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={listeLocalisations.length}
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
    );
}  
export default Localisations;