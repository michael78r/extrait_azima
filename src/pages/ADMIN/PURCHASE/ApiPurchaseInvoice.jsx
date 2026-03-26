import axios from 'axios';

export const fetchPurchaseInvoice = (id) => {
    return axios.get(`/api/purchase/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
};