import axios from 'axios';

export const fetchAllPurchaseLists = () => {
  return axios.get('/api/shopzero')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};