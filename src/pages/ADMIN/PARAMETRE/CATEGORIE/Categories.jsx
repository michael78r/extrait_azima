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
import { fetchListeCategories } from './ApiListeCategories';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {motion} from "framer-motion";
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import MyContext from '../../../MyContext';

function Categories() {
    const navigate = useNavigate();
    const username1 = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [listeCategories, setListeCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState(null)
    const [erreurcategorie, setErreurcategorie] = useState(false);
    const [erreurprix, setErreurprix] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listeCategories.length) : 0;
    useEffect(() => {
        setLoading(true);
        fetchListeCategories()
        .then(data => {
            setListeCategories(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, [])
    
    const [categorie, setNomCategorie] = useState('')
    const [prixCbm, setPrixCbm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const titleStyle = {
        color: '#1769aa',
        padding: '20px',
    };
    const styleCategorie = {
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
    
    const modifCategorie = (itemId) => {
        navigate(`/categorie/${itemId}`, { state: { param: itemId }, replace: true });
        // <Navigate to="/categorie/${itemId}" replace={true} />;
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
                axios.delete(`/api/categorie/${id}`)
                .then(function (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Supprimé avec succès!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fetchListeCategories()
                    .then(data => {
                        setListeCategories(data);
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
        if (categorie.trim() === '' || categorie.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'La categorie ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (prixCbm.trim() === '' || prixCbm.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Le prix ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (isNaN(prixCbm)) {
            Swal.fire({
                icon: 'warning',
                title: 'Le prix doit être un nombre!',
                showConfirmButton: true,
            })
            return;
        }
        setLoading(true);
        setIsSaving(true);
        let formData = new FormData()
        formData.append("categorie", categorie)
        formData.append("prixCbm", prixCbm)
        formData.append("utilisateur", username1)
        axios.post('/api/ajoutcategorie', formData)
          .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Ajouté avec succès!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            fetchListeCategories()
            .then(data => {
                setListeCategories(data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
            setNomCategorie('')
            setPrixCbm('')
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
                                    <TextField id="categorie" label="Nom de la catégorie" variant="outlined" name="categorie" 
                                    onChange={(event)=>{setNomCategorie(event.target.value)}}
                                    value={categorie} />
                                </div>
                                <div className="form-group">
                                    <TextField id="prixCbm" label="Prix / CBM" variant="outlined" name="prixCbm" 
                                    onChange={(event)=>{setPrixCbm(event.target.value)}}
                                    value={prixCbm} />
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
                                <Table sx={{ minWidth: 650 }} aria-label="liste des categories">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ whiteSpace: 'nowrap' }}>Nom de la catégorie</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Prix / CBM</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Dernière mise à jour</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Modifié par</TableCell>
                                            <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listeCategories
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((listeCategorie)=>(
                                                <TableRow
                                                    key={listeCategorie.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                    {listeCategorie.nomcategorie}
                                                    </TableCell>
                                                    <TableCell align="right">{listeCategorie.prixcbm}</TableCell>
                                                    <TableCell align="right">{listeCategorie.maj}</TableCell>
                                                    <TableCell align="right">{listeCategorie.modifiepar}</TableCell>
                                                    <TableCell><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }} style={{ float: 'left' }}><Fab color="primary" aria-label="edit"><EditIcon onClick={() => modifCategorie(listeCategorie.id)} /></Fab></motion.span><motion.span initial={{scale: 1}} whileHover={{ scale: 1.2 }} style={{ float: 'right' }}><Fab color="secondary" aria-label="edit"><DeleteForeverIcon onClick={() => handleDelete(listeCategorie.id)} /></Fab></motion.span></TableCell>
                                                </TableRow>   
                                            )
                                        )}              
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={listeCategories.length}
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
export default Categories;