import axios from 'axios';

export const fetchListeCategories = () => {
  return axios.get('/api/categories')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Renvoyer l'erreur pour une gestion ultérieure si nécessaire
    });
};