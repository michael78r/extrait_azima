import axios from 'axios';

export const fetchListeLocalisations = () => {
  return axios.get('/api/localisations')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Renvoyer l'erreur pour une gestion ultérieure si nécessaire
    });
};