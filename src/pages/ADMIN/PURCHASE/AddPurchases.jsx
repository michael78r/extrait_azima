import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2'
import axios from 'axios';
import Box from '@mui/material/Box';
import { Container, Row, Col } from 'react-grid-system';
import LayoutAdmin from '../../LayoutAdmin';
import Grid from '@mui/material/Grid';
import MyContext from '../../MyContext';
import { useNavigate } from 'react-router-dom';
import { fetchShopsLists } from '../SHOP/ApiShopsList';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';

function AddPurchases() {
    document.title = "Make a purchase";
    const navigate = useNavigate();
    const [fields, setFields] = useState([{ id: 1, value: '' }]);
    const [nextId, setNextId] = useState(2);
    const [isSaving, setIsSaving] = useState(false);
    const username1 = useContext(MyContext);
    const [shopsLists, setShopsLists] = useState([]);
    const [shopValue, setShopValue] = useState('');
    const [goods, setGoods] = useState([]);
    const [goodsValue, setGoodsValue] = useState('');
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false);

    const annuler = () => {
        navigate(`/purchase`, { replace: true });
    }

    const handleAddField = () => {
        setFields([...fields, { id: nextId, value: '' }]);
        setNextId(nextId + 1);
    };

    const handleRemoveField = (id) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleChange = (id, event) => {
        const newFields = fields.map(field => {
        if (field.id === id) {
            return { ...field, value: event.target.value };
        }
        return field;
        });
        setFields(newFields);
    };

    const handleSubmit = async () => {
        console.log(JSON.stringify(fields))
        // try {
        //   const response = await fetch('http://localhost:8000/api/users', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(fields)
        //   });
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
        //   alert('Users added successfully');
        // } catch (error) {
        //   console.error('There was a problem with the fetch operation:', error);
        // }
    };

    useEffect(() => {
        setLoading(true);
        fetchShopsLists()
        .then(data => {
            setShopsLists(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, []);

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
                <div>
                    <h1>Gérer les champs texte</h1>
                    <Autocomplete
                        options={shopsLists.map(shop => ({
                            id: shop.id,
                            shopname: shop.shopname,
                            section: shop.section,
                            location: shop.location
                        }))}
                        onInputChange={(event, newShopValue) => {
                            setShopValue(newShopValue);
                        }}
                        onChange={(event, newValue) => {
                            setShopValue(newValue);
                        }}
                        sx={{ width: 600 }}
                        getOptionLabel={(option) => `${option.location} ${option.section} // ${option.shopname}`}
                        renderInput={(params) => <TextField {...params} label="Shopname" variant="outlined"
                        />}
                    />
                    <div>{shopValue ? shopValue.id : 'Aucun shop sélectionné'}</div>
                    {/* <button onClick={handleAddField}>Ajouter un champ</button>
                    {fields.map((field) => (
                        <div key={field.id}>
                        <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleChange(field.id, e)}
                            placeholder={`Champ ${field.id}`}
                        />
                        <button onClick={() => handleRemoveField(field.id)}>Supprimer</button>
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Envoyer</button> */}
                </div>
            )}
            </Box>
        </LayoutAdmin>
    );
}

export default AddPurchases;