import axios from 'axios';

export const fetchGoodInventory = (brand_id, city_id) => {
  return axios.get(`/api/inventory/city/${city_id}/brand/${brand_id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
};
