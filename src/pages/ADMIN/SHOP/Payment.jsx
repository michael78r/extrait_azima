import React, { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Payment = () => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    console.log("Date:", date);
    console.log("Amount:", amount);
  };

  const handleCancel = () => {
    setDate('');
    setAmount('');
  };

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handleAdd}>
            Add
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" fullWidth onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
