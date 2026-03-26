import React, {useState, useEffect, useContext} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container, Row, Col } from 'react-grid-system';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';

function AddCity() {
    document.title = "Add a city";
    const navigate = useNavigate();
    const [cityname, setCityName] = useState('');
   
    const [isSaving, setIsSaving] = useState(false);
    const username1 = useContext(MyContext);
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
        let formData = new FormData()
        formData.append("cityname", cityname)
        formData.append("utilisateur", username1)
        axios.post(`/api/addcity`,formData)
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
                <Container>
                    <Grid container justifyContent="center">
                        <Grid item xs={12}>
                            <h1>Add a city</h1>
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
                                        Add
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
            </Box>
        </LayoutAdmin>
    );
}
export default AddCity;