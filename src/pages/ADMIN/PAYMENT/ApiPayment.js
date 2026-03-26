
import axios from 'axios';

export const fetchPaymentLists = () => {
    return axios.get(`/api/payments`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
};