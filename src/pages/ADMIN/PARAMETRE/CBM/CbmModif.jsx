import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container, Row, Col } from 'react-grid-system';
import LayoutAdmin from '../../../LayoutAdmin';
import MyContext from '../../../MyContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function CbmModif() {
    document.title = "Modifier le tarif min";
    const navigate = useNavigate();
    const [cbmmin, setCbmmin] = useState('')
    const [maj, setMaj] = useState('')
    const [modifierpar, setModifierpar] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/cbm`)
        .then(function (response) {
            let cbmmin = response.data
            setCbmmin(cbmmin.cbmmin);
            setMaj(cbmmin.maj);
            setModifierpar(cbmmin.modifierpar);
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

    const handleSave = () => {
        if (cbmmin === '' || cbmmin === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Le prix ne peut pas être vide!',
                showConfirmButton: true,
            })
            return;
        }
        if (isNaN(cbmmin)) {
            Swal.fire({
                icon: 'warning',
                title: 'Le prix doit être un nombre!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/cbm`, {
            cbmmin: cbmmin,
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
            navigate(`/parametre?tab=2`, { replace: true });
            window.location.reload();
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
                <Grid container spacing={2}>
                <Grid item xs={8}>
                <Container>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-left align-items-left">
                        <form>
                            <Row>
                                <div className="form-group">
                                    <TextField id="cbmmin" label="Prix minimum" variant="outlined" name="cbmmin" 
                                    onChange={(event)=>{setCbmmin(event.target.value)}}
                                    value={cbmmin} />
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
                                    Modifier
                                </Button>
                            </Col>
                            </Row>
                        </form>
                        </Col>
                    </Row>
                </Container>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Tarif minimum
                            </Typography>
                            <Typography variant="h5" component="div">
                                {cbmmin}
                            </Typography>
                            <Typography variant="body2">
                                <br /><br />
                                Dernière modification : {maj}
                                <br />
                                Par : {modifierpar}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                </Grid>
            )}
            </Box>
        </LayoutAdmin>
    );
}
export default CbmModif;