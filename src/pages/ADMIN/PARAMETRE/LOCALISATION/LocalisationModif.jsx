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

function LocalisationModif() {
    document.title = "Modifier un categorie";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [region, setRegion] = useState('')
    const [pays, setPays] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/localisation/${id}`)
        .then(function (response) {
            let localisation = response.data
            setRegion(localisation.region);
            setPays(localisation.pays);
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
        //         // setNomunite(data.nomunite);
        //         // setAlias(data.alias);
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
        navigate(`/parametre?tab=3`, { replace: true });
    }

    const handleSave = () => {
        if (region.trim() === '' || region.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'La region ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (pays === '' || pays === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Le pays ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/localisation/${id}`, {
            region: region,
            pays: pays,
            utilisateur: username1
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Modifié avec succès!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/parametre?tab=3`, { replace: true });
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
                            <h1>Modification du localisation</h1>
                        </Grid>
                    </Grid>
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
export default LocalisationModif;