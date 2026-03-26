import axios from 'axios';

export const fetchPurchaseLists = () => {
  return axios.get('/api/purchases')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};