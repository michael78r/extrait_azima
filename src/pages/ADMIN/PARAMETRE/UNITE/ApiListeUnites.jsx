import axios from 'axios';

export const fetchListeUnites = () => {
  return axios.get('/api/unites')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Renvoyer l'erreur pour une gestion ultérieure si nécessaire
    });
};