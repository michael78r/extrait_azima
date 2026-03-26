import axios from 'axios';

const fetchModifCategorie = async (id) => {
  try {
    const response = await axios.get(`/api/categorie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données :', error);
    throw error; // Vous pouvez choisir de gérer l'erreur différemment si nécessaire
  }
};

export default fetchModifCategorie;