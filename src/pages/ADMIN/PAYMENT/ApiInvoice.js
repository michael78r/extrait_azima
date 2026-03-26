
import axios from 'axios';

export const fetchInvoiceLists = () => {
    return axios.get(`/api/invoices`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
};