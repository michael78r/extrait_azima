import React from 'react';
import * as XLSX from 'xlsx';

const ExportExcel = ({ data, fileName }) => {
  const handleExport = () => {
    // Créer une nouvelle feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Créer un nouveau classeur et y ajouter la feuille de calcul
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Générer le fichier Excel et déclencher le téléchargement
    XLSX.writeFile(workbook, fileName || 'export.xlsx');
  };

  return (
    <button onClick={handleExport}>
      Exporter vers Excel
    </button>
  );
};

export default ExportExcel;