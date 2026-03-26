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
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';

function UpdateCity() {
    document.title = "Modify a city";
    const navigate = useNavigate();
    const [id, setId] = useState(useParams().id)
    const [cityname, setCityName] = useState('');
    const [isSaving, setIsSaving] = useState(false)
    const [loading, setLoading] = useState(true);
    const username1 = useContext(MyContext);
    useEffect(() => {
        axios.get(`/api/city/${id}`)
        .then(function (response) {
            let city = response.data
            setCityName(city.cityname);
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
    }, []);

    const annuler = () => {
        navigate(`/city`, { replace: true });
    }

    const handleSave = () => {
        if (cityname.trim() === '' || cityname.trim() === null) {
            Swal.fire({
                icon: 'warning',
                title: 'The name of the city cannot be empty!',
                showConfirmButton: true,
            })
            return;
        }
        setIsSaving(true);
        axios.patch(`/api/city/${id}`, {
            cityname: cityname,
            utilisateur: username1
        })
        .then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            })
            setIsSaving(false);
            navigate(`/city`, { replace: true });
        })
        .catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'There is at least an error with your data!',
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
                            <h1>Modify the city</h1>
                        </Grid>
                    </Grid>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-left align-items-left">
                        <form>
                            <Row>
                                <div className="form-group">
                                    <TextField id="cityname" label="City name" variant="outlined" name="cityname" 
                                    onChange={(event)=>{setCityName(event.target.value)}}
                                    value={cityname} />
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
                                        Update
                                    </Button>
                                    <Button 
                                        sx={{ m: 1, minWidth: 120 }}
                                        onClick={annuler} 
                                        type="button"
                                        className="btn btn-outline-primary mt-3"
                                        variant="outlined"
                                        color="error">
                                        Cancel
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
export default UpdateCity;