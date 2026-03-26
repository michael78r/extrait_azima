import React, { useState } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Typography, Table, TableBody } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SalespersonOrder from './SalespersonOrder';

const DailyOrder = ({ date, data, formatter, editPurchase, handleDelete }) => {
    const [openDate, setOpenDate] = useState(false);

    console.log('daily orders', data);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenDate(!openDate)}
                    >
                        {openDate ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell style={{ fontWeight: 'bold', color: 'blue' }}>{date}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={openDate} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="salespersons">
                                <TableBody>
                                    {Object.keys(data).map(salesname => (
                                        <SalespersonOrder
                                            key={salesname}
                                            name={salesname}
                                            data={data[salesname]}
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

export default DailyOrder;