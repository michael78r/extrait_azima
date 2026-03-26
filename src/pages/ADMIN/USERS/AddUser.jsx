import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, CircularProgress ,Autocomplete,Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function AddUser() {
    document.title = "Add user";
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [selectedRole,setSelectedRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const roles = ["ADMIN","SALES"];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (!validateEmail(event.target.value)) {
            setError("Please enter a valid email");
        } else {
            setError(null); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        if (username.trim() === '' || password.trim() === '' || !validateEmail(email)) {
            setError('Username and password are required');
            return;
        }

        setIsSaving(true);
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("contact", contact);
        formData.append("email", email);
        formData.append("roles", selectedRole);

        try {
            const response = await axios.post(`/api/adduser`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false,
                timer: 1500
            });
            setIsSaving(false);
            navigate(`/`, { replace: true });
        } catch (error) {
            setIsSaving(false);
            if (error.response && error.response.status === 409) {
                // Error 409: Username is already taken
                setError('The username is already in use. Please choose another one.');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'There was an error processing your request!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    const annuler = () => {
        navigate(-1, { replace: true });
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Paper elevation={3} sx={{ padding: 4, mt: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Add a new user
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Username"
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                    error={Boolean(error && username.trim() === '')}
                    helperText={username.trim() === '' && error ? 'This field is required' : ''}
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    autoComplete="off"
                    error={Boolean(error && password.trim() === '')}
                    helperText={password.trim() === '' && error ? 'This field is required' : ''}
                />
                <TextField
                    label="Phone number"
                    name="contact"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    fullWidth
                    margin="normal"
                    autoComplete="off"
                />
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    autoComplete="off"
                />
                <Autocomplete
                options={roles}
                value={selectedRole}
                onChange={(event, value) => setSelectedRole(value)}
                renderInput={(params) => <TextField {...params} label="Select role" />}
                sx={{ mb: 3 }}
                />

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                             variant="outlined"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mr: 2, minWidth: '120px' }}
                            disabled={isSaving || username==="" || username===null || password==="" || password===null || contact===null || contact ===''
                            ||  email===null || email==='' || selectedRole===null || selectedRole===''
                            }
                        >
                            {isSaving ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                        <Button 
                        onClick={annuler} 
                        type="button"
                        variant="outlined"
                        color="error"
                        sx={{ minWidth: '120px' }}
                        >
                        Cancel
                        </Button>
                    </Box>
            </form>
            </Paper>
        </Box>
    );
}

export default AddUser;