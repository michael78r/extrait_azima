import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';

const ExportGroupedShop = ({ data, fileName, Nombouton, months, isShopwise }) => {
    const handleExport = () => {
        const formattedData = [];
        // const totalMois = Array(12).fill(0);

        Object.keys(data).forEach(brand => {
            const product = data[brand];
            const res = [];
            months.forEach((month, index) => {
                const row = { Brand: brand };
                row['crtn'] = product.firstMetric[index];
                row['pckt'] = product.secondMetric[index];
                row['pcs'] = product.thirdMetric[index];
                row['sac'] = product.fourthMetric[index];
                row['bottle'] = product.fifthMetric[index];
                res.push(row);
            });
            formattedData.push(res);
        });

        console.log(formattedData);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

        const headers = [['Brand']];
        const subHeaders = [['']];

        months.forEach(month => {
            headers[0].push(month, '', '', '', '');
            // if (isShopwise) {
            //     subHeaders[0].push("Quantity", "Total value");
            // } else {
            subHeaders[0].push("Carton", "Packets", "Pieces", "Sac", "Bottle");
            // }
        });

        XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' });
        XLSX.utils.sheet_add_aoa(worksheet, subHeaders, { origin: 'A2' });

        formattedData.forEach((rows, index) => {
            // Pour chaque "brand", on veut une seule ligne avec toutes les valeurs des mois à la suite
            const rowData = [rows[0]?.Brand || ''];
            rows.forEach(row => {
                rowData.push(row.crtn, row.pckt, row.pcs, row.sac, row.bottle);
            });
            XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${index + 3}` }); // +3 car headers sur 2 lignes
        });

        // worksheet['!merges'] = [];
        // let colIndex = 1;
        // months.forEach(() => {
        //     worksheet["!merges"].push({
        //         s: { r: 0, c: colIndex },
        //         e: { r: 0, c: colIndex + (isShopwise ? 1 : 2) }
        //     });
        //     colIndex += (isShopwise) ? 2 : 3;
        // });

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
            [{ wch: 12 }, { wch: 10 }, { wch: 15 }]
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

export default ExportGroupedShop;
