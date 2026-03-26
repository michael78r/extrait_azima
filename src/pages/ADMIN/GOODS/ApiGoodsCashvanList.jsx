import axios from 'axios';

export const fetchGoodsCashvanLists = () => {
  return axios.get('/api/goodscashvan')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};