import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

const formatDate = (dateString) => {
    if (dateString === '1900-01-01T00:00:00+00:00') {
        return '';
    }
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

const ExportToExcel = ({ data, fileName, headers, Nombouton }) => {
  const handleExport = () => {
    const formattedData = data.map(item => {
        let formattedItem = {};
        headers.forEach(header => {
            let value = item[header.key];
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                value = formatDate(value);
            }
            formattedItem[header.label] = value;
        });
        return formattedItem;
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "ADD8E6" } }
    };
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { c: col, r: 0 };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!worksheet[cellRef]) worksheet[cellRef] = {};
      worksheet[cellRef].s = headerStyle;
    }
    const colWidths = headers.map(header => {
        const col = header.label;
        const maxLength = Math.max(
          ...formattedData.map(row => row[col] ? row[col].toString().length : 0),
          col.length
        );
        return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mes donnees");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="contained" color="primary">
      {Nombouton}
    </Button>
  );
};

export default ExportToExcel;