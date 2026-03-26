import axios from 'axios';
export const fetchShopPaymentLists = () => {
    return axios.get(`/api/shopspayment`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
};