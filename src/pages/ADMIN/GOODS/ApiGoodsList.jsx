import axios from 'axios';

export const fetchGoodsLists = () => {
  return axios.get('/api/goods')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};