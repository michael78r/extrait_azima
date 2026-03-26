import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Table, TableBody } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShopOrder from './ShopOrder';

const SalespersonOrder = ({ name, data, formatter, editPurchase, handleDelete }) => {
    const [openName, setOpenName] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenName(!openName)}
                    >
                        {openName ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Salesperson : {name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={openName} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="shops">
                                <TableBody>
                                    {Object.keys(data).map(shopName => (
                                        <ShopOrder
                                            key={shopName}
                                            shopName={shopName}
                                            data={data[shopName]}
                                            formatter={formatter}
                                            editPurchase={editPurchase}
                                            handleDelete={handleDelete}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default SalespersonOrder;