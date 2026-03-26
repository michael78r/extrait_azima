import axios from 'axios';

export const fetchShopsLists = () => {
  return axios.get('/api/shops')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};