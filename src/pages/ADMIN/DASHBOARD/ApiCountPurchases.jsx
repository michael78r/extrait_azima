import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const fetchPurchaseCount = async () => {
    try {
        const response = await axios.get('/api/countpurchase');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};