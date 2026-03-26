import React from 'react';
import numberToWords from 'number-to-words';

const convertNumberToWords = (number) => {
  // Séparation de la partie entière et de la partie décimale
  const [integerPart, decimalPart] = number.toString().split('.');

  let words = '';
  
  // Convertir la partie entière
  if (integerPart) {
    words += numberToWords.toWords(parseInt(integerPart, 10));
  }

  // Convertir la partie décimale si elle existe
  if (decimalPart) {
    words += ' point ';
    // Convertir chaque chiffre de la partie décimale
    for (let i = 0; i < decimalPart.length; i++) {
      words += numberToWords.toWords(parseInt(decimalPart[i], 10)) + ' ';
    }
  }

  return words.trim(); // Retirer les espaces inutiles
};

// Fonction pour capitaliser la première lettre d'une chaîne
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const AmountInWords = ({ amount }) => {
  const amountInWords = convertNumberToWords(amount);
  const words = amountInWords.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  const finalAmount = capitalizedWords.join(' ');
  return (
    <div>
      <p><strong>Ariary {finalAmount.replace(/,/g, '')} Only</strong></p>
    </div>
  );
};

export default AmountInWords;