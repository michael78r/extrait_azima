import React ,{useState,useEffect} from 'react';
import { fetchInventoriesList } from './ApiInventory';
import LayoutAdmin from '../../LayoutAdmin';
import {Box , Paper,TableContainer,Table,TableHead,TableCell,TableRow,TableBody} from '@mui/material';
import formaterNombre from '../../formaterNombre';
const ItemList = () =>{
    document.title = "List of inventories";
    const [inventories,setInventories] = useState([]);
    useEffect(() => {
        fetchInventoriesList()
        .then(data => {
            setInventories(data);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
    }, []);

    return (
        <LayoutAdmin>
            <Box>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="Inventories lists">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'nowrap' }}>Brand</TableCell>
                                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Number of sac</TableCell>
                                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Number of carton</TableCell>
                                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Number of pqt</TableCell>
                                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>Number of piece</TableCell>
                                <TableCell align="right" style={{ whiteSpace: 'nowrap' }}>City</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventories.map((inventory)=>(
                                    <TableRow
                                        key={inventory.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                        {inventory.Brand}
                                        </TableCell>
                                        <TableCell align="right">{formaterNombre(inventory.sacNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(inventory.cartonNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(inventory.boxNumber)}</TableCell>
                                        <TableCell align="right">{formaterNombre(inventory.pieceNumber)}</TableCell>
                                        <TableCell align="right">{inventory.CityName}</TableCell>
                                    </TableRow>   
                                )
                            )}              
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </LayoutAdmin>
    );
}

export default ItemList;