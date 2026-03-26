import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container, Row, Col } from 'react-grid-system';
import { useParams } from 'react-router-dom';
import LayoutAdmin from '../../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../../MyContext';
import { useNavigate } from 'react-router-dom';

function CategorieModif() {
    document.title = "Modifier un categorie";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [nomcategorie, setNomCategorie] = useState('')
    const [prixCbm, setPrixCbm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/categorie/${id}`)
        .then(function (response) {
            let categorie = response.data
            setNomCategorie(categorie.nomcategorie);
            setPrixCbm(categorie.prixcbm);
            setLoading(false);

        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false);
        })
        // const fetchDataFromCategorie = async () => {
        //     try {
        //         const result = await fetchModifCategorie(id);
        //         setData(result);
        //         // setNomCategorie(data.nomcategorie);
        //         // setPrixCbm(data.prixcbm);
        //         setLoading(false);
        //     } catch (error) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Il y a une erreur! Veuillez verifier vos données!',
        //             showConfirmButton: false,
        //             timer: 1500
        //         });
        //         setLoading(false);
        //     }
        // };
        // fetchDataFromCategorie();
    }, []);

    const annuler = () => {
        navigate(`/parametre?tab=0`, { replace: true });
    }

    const handleSave = () => {
        if (nomcategorie.trim() === '' || nomcategorie.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'La categorie ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (prixCbm === '' || prixCbm === null) {
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
        setIsSaving(true);
        axios.patch(`/api/categorie/${id}`, {
            nomcategorie: nomcategorie,
            prixCbm: prixCbm,
            utilisateur: username1
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Ajouté avec succès!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/parametre?tab=0`, { replace: true });
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Il y a une erreur! Veuillez verifier vos données!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false)
        });
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
                    <Grid container justifyContent="center">
                        <Grid item xs={12}>
                            <h1>Modification d'une catégorie</h1>
                        </Grid>
                    </Grid>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-left align-items-left">
                        <form>
                            <Row>
                                <div className="form-group">
                                    <TextField id="nomcategorie" label="Nom de la catégorie" variant="outlined" name="nomcategorie" 
                                    onChange={(event)=>{setNomCategorie(event.target.value)}}
                                    value={nomcategorie} />
                                </div>
                                <div className="form-group">
                                    <TextField id="prixCbm" label="Prix / CBM" variant="outlined" name="prixCbm" 
                                    onChange={(event)=>{setPrixCbm(event.target.value)}}
                                    value={prixCbm} />
                                </div>
                            </Row>
                            <Row>
                            <Col sm={6} className="d-flex justify-content-left align-items-left">
                                <Button 
                                    sx={{ m: 1, minWidth: 120 }}
                                    disabled={isSaving}
                                    onClick={handleSave} 
                                    type="button"
                                    className="btn btn-outline-primary mt-3"
                                    variant="outlined"
                                    color="success">
                                    Modifier
                                </Button>
                                <Button 
                                    sx={{ m: 1, minWidth: 120 }}
                                    onClick={annuler} 
                                    type="button"
                                    className="btn btn-outline-primary mt-3"
                                    variant="outlined"
                                    color="error">
                                    Annuler
                                </Button>
                            </Col>
                            </Row>
                        </form>
                        </Col>
                    </Row>
                </Container>
            )}
            </Box>
        </LayoutAdmin>
    );
}
export default CategorieModif;