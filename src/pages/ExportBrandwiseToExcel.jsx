import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';

const ExportBrandwiseToExcel = ({ data, fileName, Nombouton, months, isShopwise }) => {
  const handleExport = () => {
    const formattedData = [];

    Object.keys(data).forEach(brand => {
      const product = data[brand];
      const types = ['Crtn', 'Pkt', 'Pcs','Sac'];

      types.forEach(type => {
        const row = { Brand: brand };

        months.forEach((month, index) => {
          if (type === 'Pkt') {
            row[`${month} (Quantity)`] = `${product.BoxNumber[index]} Pkt `;
            if(!isShopwise){
              row[`${month} (Value)`] = product.PriceBox[index];
            }
            row[`${month} (Total value)`] = product.Totalboxvalue[index];
          } else if (type === 'Crtn') {
            row[`${month} (Quantity)`] = `${product.CartonNumber[index]} Crtn`;
            if(!isShopwise){
              row[`${month} (Value)`] = product.PriceCtn[index];
            }
            row[`${month} (Total value)`] = product.Totalctnsvalue[index];
          } else if (type === 'Pcs') {
            row[`${month} (Quantity)`] = `${product.ItemNumber[index]} Pcs`;
            if(!isShopwise){
              row[`${month} (Value)`] = product.PriceItem[index];
            }
            row[`${month} (Total value)`] = product.Totalitemvalue[index];
          } else if (type === 'Sac') {
            row[`${month} (Quantity)`] = `${product.SacNumber[index]} Sac`;
            if(!isShopwise){
              row[`${month} (Value)`] = product.PriceSac[index];
            }
            row[`${month} (Total value)`] = product.Totalsacvalue[index];
          }
        });

        formattedData.push(row);
      });
    });
    
    console.log(formattedData);
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

    const headers = [['Brand']];
    const subHeaders = [['']];

    months.forEach(month => {
      headers[0].push(month, '', '');
      if (isShopwise) {
        subHeaders[0].push("Quantity", "Total value");
      } else {
        subHeaders[0].push("Quantity", "Value", "Total value");
      }
    });

    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(worksheet, subHeaders, { origin: 'A2' });

    formattedData.forEach((row, index) => {
      const rowData = [
        row.Brand, 
        ...months.map(month => [
          row[`${month} (Quantity)`],
          isShopwise ? row[`${month} (Total value)`] : [row[`${month} (Value)`], row[`${month} (Total value)`]],
        ]).flat(),
      ].flat();
      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 3}` });
    });

    worksheet['!merges'] = [];
    let colIndex = 1;
    months.forEach(() => {
      worksheet["!merges"].push({
        s: { r: 0, c: colIndex },
        e: { r: 0, c: colIndex + (isShopwise ? 1 : 2) }  
      });
      colIndex += (isShopwise) ? 2 : 3;
    });

    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "ADD8E6" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    const subHeaderStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "ADD8E6" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Appliquer les styles aux headers
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[headerCellRef]) worksheet[headerCellRef] = { t: 's', v: '' };
      worksheet[headerCellRef].s = headerStyle;

      const subHeaderCellRef = XLSX.utils.encode_cell({ r: 1, c: C });
      if (!worksheet[subHeaderCellRef]) worksheet[subHeaderCellRef] = { t: 's', v: '' };
      worksheet[subHeaderCellRef].s = subHeaderStyle;
    }

    const colWidths = months.flatMap(() =>
      isShopwise
        ? [{ wch: 12 }, { wch: 15 }]
        : [{ wch: 12 }, { wch: 10 }, { wch: 15 }]
    );

    worksheet['!cols'] = [{ wch: 30 }, ...colWidths];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mes donnees');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="contained" color="primary">
      {Nombouton}
    </Button>
  );
};

export default ExportBrandwiseToExcel;
