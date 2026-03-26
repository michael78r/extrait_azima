import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import AmountInWords from '../../AmountInWords';
import { useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from '@mui/material';
import formaterNombre from '../../formaterNombre';
// import getAmountInWords from '../../AmountInWords';


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

const getAmountInWords = (amount) => {
  const amountInWords = convertNumberToWords(amount);
  const words = amountInWords.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(' ').replace(/,/g, '');
};

const ExporterBon = () => {
    const formatter = new Intl.NumberFormat('fr-FR');
    const { state } = useLocation();
    const {
        date,
        time,
        name,
        invoicelabel,
        shopName,
        items,
        promotions,
        paymentType,
        cashAmount,
        creditAmount,
        location,
        noMobile
    } = JSON.parse(sessionStorage.getItem('invoiceData'));
    const [remarks, setRemarks] = useState('');
    const navigate = useNavigate();
    const invoiceRef = useRef();
    let lineNumber = 1;
    let linesNumber = 1;

    const generatePdf = async () => {
        const itemsPerPage = 15; 
        const totalPages = Math.ceil(items.length / itemsPerPage); 

        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            // Divisez les articles pour cette page
            const start = pageIndex * itemsPerPage;
            const end = start + itemsPerPage;
            const itemsForPage = items.slice(start, end);
            const promotion = promotions.slice(start, end)

            const pageContainer = document.createElement('div');
            // pageContainer.style.display = 'flex';
            // pageContainer.style.flexDirection = 'column';
            pageContainer.style.minHeight = '297mm'; // Hauteur A4
            pageContainer.style.width = '210mm'; // Largeur A4
            pageContainer.style.padding = '10mm 2mm';
            pageContainer.style.backgroundColor = 'white';
            pageContainer.style.boxSizing = 'border-box';
            pageContainer.style.position = 'absolute';
            pageContainer.style.top = '-9999px';

            const contentWrapper = document.createElement('div');
            contentWrapper.style.flex = '1';

            // Ajoutez le titre et les informations de l'en-tête
            const header = document.createElement('div');
            header.innerHTML = `
                <center style="font-weight: bold;">BON DE LIVRAISON<br /><br /></center>
    <table style="width: 100%; border-collapse: collapse">
        <tbody>
            <tr>
                <td rowspan="3" colspan="4" style="white-space: nowrap; border: 1px solid; vertical-align: top; padding: 5px;">
                    <strong>Societe Azima Sarl</strong><br />
                    LOT 06 F 160 MAHAZOARIVO SUD ANSIRABE I<br />
                    Madagascar<br />
                </td>
                <td colspan="2" style="white-space: nowrap; border: 1px solid; vertical-align: top; padding: 5px;">Invoice No.<br /><strong>${invoicelabel}</strong></td>
                <td colspan="2" style="white-space: nowrap; border: 1px solid; vertical-align: top; padding: 5px;">Dated<br /><strong>${date} at ${time}</strong></td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 40%;">Delivery Note</td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 60%;">Mode/Terms of Payment</td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 40%;">Reference No. & Date</td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 60%;">Other References</td>
            </tr>
            <tr>
                <td rowspan="4" colspan="4" style="white-space: nowrap; border: 1px solid; vertical-align: top; padding: 5px; width: 40%;">
                    Buyer (Bill to)<br />
                    <strong>${shopName}</strong><br />
                    ${location}<br />
                    Mob No ${noMobile}<br />
                    ${name} Client <br />
                </td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Buyer's Order No.</td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Dated</td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Dispatch Doc No.</td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Delivery Note Date</td>
            </tr>
             <tr>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Dispatched through</td>
                <td colspan="2" style="border: 1px solid; vertical-align: top; padding: 5px; width: 30%;">Destination</td>
            </tr>
            <tr>
                <td colspan="4" style="border: 1px solid; vertical-align: top; padding: 5px; padding-bottom: 30px;">Terms of Delivery</td>
            </tr>
            `;
            contentWrapper.appendChild(header);

            // Créez une table temporaire avec les données pour cette page
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '20px';

            // Ajoutez l'en-tête de la table
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th style="border: 1px solid; text-align: center;">No.</th>
                <th style="border: 1px solid; text-align: left;" colspan="3">Description of Goods</th>
                <th style="border: 1px solid; text-align: center;">Pkgs</th>
                <th style="border: 1px solid; text-align: center;">Qty</th>
                <th style="border: 1px solid; text-align: center;">Rate</th>
                <th style="border: 1px solid; text-align: center;">Amount</th>
            `;
            table.appendChild(headerRow);

            // contentWrapper.appendChild(header);
            // table.appendChild(headerRow);

            // Ajoutez les articles pour cette page

            itemsForPage.forEach((item, index) => {
                // Sacs
                if (+item.sacNumber !== 0 && +item.priceSac !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Sac</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.sacNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.priceSac)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalSacValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Cartons
                if (+item.cartonNumber !== 0 && +item.priceCarton !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Ctn</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.cartonNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.priceCarton)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalCtnsValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Paquets
                if (+item.boxNumber !== 0 && +item.priceBox !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Pqt</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.boxNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.priceBox)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalBoxValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Pièces
                if (+item.itemNumber !== 0 && +item.priceItem !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Pcs</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.itemNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.priceItem)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalItemValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Bouteilles
                if (+item.bottleNumber !== 0 && +item.priceBottle !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Btl</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.bottleNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.priceBottle)}</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalBottleValue)}</td>
                    `;
                    table.appendChild(row);
                }
            });

            promotion.forEach((item, index) => {
                if (+item.sacNumber !== 0 && +item.priceSac !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Sac</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.sacNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">Free</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalSacValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Cartons
                if (+item.cartonNumber !== 0 && +item.priceCarton !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Ctn</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.cartonNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">Free</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalCtnsValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Paquets
                if (+item.boxNumber !== 0 && +item.priceBox !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Pqt</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.boxNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">Free</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalBoxValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Pièces
                if (+item.itemNumber !== 0 && +item.priceItem !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${linesNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Pcs</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.itemNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">Free</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalItemValue)}</td>
                    `;
                    table.appendChild(row);
                }

                // Bouteilles
                if (+item.bottleNumber !== 0 && +item.priceBottle !== 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid; text-align: center;">${lineNumber++}</td>
                        <td style="border: 1px solid;" colspan="3">${item.brand}</td>
                        <td style="border: 1px solid; text-align: center;">Btl</td>
                        <td style="border: 1px solid; text-align: center;">${formaterNombre(item.bottleNumber)}</td>
                        <td style="border: 1px solid; text-align: right;">Free</td>
                        <td style="border: 1px solid; text-align: right;">${formaterNombre(item.totalBottleValue)}</td>
                    `;
                    table.appendChild(row);
                }
            })

            contentWrapper.appendChild(table);
            pageContainer.appendChild(contentWrapper);

            if (pageIndex === totalPages - 1) {

                // Ajouter le total
                const totalRow = document.createElement('tr');
                totalRow.innerHTML = `
                    <td style="border: 1px solid;"></td>
                    <td style="border: 1px solid; text-align: center; font-weight: bold;">Total</td>
                    <td style="border: 1px solid;" colspan="5"></td>
                    <td style="border: 1px solid; text-align: right; font-weight: bold; white-space: nowrap;">Ar ${formaterNombre(totalSum)}</td>
                `;
                table.appendChild(totalRow);

                // Créer une nouvelle table pour les informations complémentaires
                const footerTable = document.createElement('table');
                footerTable.style.width = '100%';
                footerTable.style.borderCollapse = 'collapse';
                footerTable.style.marginTop = '20px';

                // Montant en lettres
                const amountInWordsRow = document.createElement('tr');
                amountInWordsRow.innerHTML = `
                    <td style="
                        border: 1px solid;
                        height: 150px;        /* Hauteur fixe */
                        vertical-align: top;  /* Alignement en haut */
                        padding: 8px 5px;     /* Espacement intérieur (8px haut/bas, 5px gauche/droite) */
                        " colspan="2">
                        <div style="margin-bottom: 5px;">Amount Chargeable (in words)</div>
                        <strong>${getAmountInWords(totalSum)} Ariary</strong>
                    </td>
                `;
                footerTable.appendChild(amountInWordsRow);

                // Mode de paiement
                const paymentRow = document.createElement('tr');
                let paymentContent = '';
                if (paymentType === 'credit') {
                    paymentContent = 'Credit';
                } else if (paymentType === 'cash') {
                    paymentContent = 'Cash';
                } else if (paymentType === 'both') {
                    paymentContent = `
                        Credit and Cash<br/>
                        <strong>Cash: </strong>Ar ${formaterNombre(cashAmount)}<br/>
                        <strong>Credit: </strong>Ar ${formaterNombre(creditAmount)}
                    `;
                }

                paymentRow.innerHTML = `
                    <td style="border: 1px solid;" colspan="1">Mode/Terms of Payment</td>
                    <td style="border: 1px solid;" colspan="1">${paymentContent}</td>
                `;
                footerTable.appendChild(paymentRow);

                // Remarques
                const remarksRow = document.createElement('tr');
                remarksRow.innerHTML = `
                    <td style="border: 1px solid;" colspan="2">Remarks: <br/>${remarks || ''}</td>
                `;
                footerTable.appendChild(remarksRow);

                // Déclaration et signature
                const declarationRow = document.createElement('tr');
                declarationRow.innerHTML = `
                    <td style="border: 1px solid;" width="50%">Declaration<br/>We declare that this invoice shows the actual price
                        of the goods described and that all particulars are true and correct.</td>
                    <td style="border: 1px solid;" width="50%" vertical-align: top;><p style="text-align: right"><strong>for Societe Azima Sarl</strong></p>
                        <p style="vertical-align: bottom; text-align: right;">Authorised Signatory</p>
                    </td>
                `;
                footerTable.appendChild(declarationRow);

                const chauffeur = document.createElement('tr');
                chauffeur.innerHTML = `
                    <td style="
                        border: 1px solid; 
                        height: 80px;
                        vertical-align: top;  /* Alignement en haut */
                        padding: 5px;        /* Espacement intérieur */
                        ">
                        Depot Signatory
                    </td>
                    <td style="
                        border: 1px solid;
                        height: 80px;
                        vertical-align: top;  /* Alignement en haut */
                        padding: 5px;        /* Espacement intérieur */
                        ">
                        Chauffeur Signatory
                    </td>
                `;
                footerTable.appendChild(chauffeur);

                // Mention générée par ordinateur
                const computerGeneratedRow = document.createElement('tr');
                computerGeneratedRow.innerHTML = `
                        <td style="
                            border: 1px solid; 
                            text-align: center;
                            padding: 8px;
                            font-size: 12px;
                            color: #666;
                            " colspan="8">
                            This is a computer generated document and does not require a signature.
                        </td>
                `;
                footerTable.appendChild(computerGeneratedRow);

                // Ajouter la table de pied de page au conteneur principal
                pageContainer.appendChild(footerTable);
            }

            else {
                // Ajoutez "Continued..." si ce n'est pas la dernière page
                const continuedRow = document.createElement('div');
                continuedRow.style.marginTop = 'auto';
                continuedRow.style.textAlign = 'center';
                continuedRow.style.padding = '10px';
                continuedRow.innerHTML = '<strong>Continued...</strong>';
                pageContainer.appendChild(continuedRow);
            }

            //tempDiv.appendChild(table);

            document.body.appendChild(pageContainer); // Ajoutez le conteneur temporaire au DOM

            // Convertissez le conteneur temporaire en image
            const canvas = await html2canvas(pageContainer, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = pdfWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const x = (pdfWidth - imgWidth) / 2; // Centrer horizontalement
            const y = margin;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

            // Supprimez le conteneur temporaire
            document.body.removeChild(pageContainer);

            // Ajoutez une nouvelle page si ce n'est pas la dernière
            if (pageIndex < totalPages - 1) {
                pdf.addPage();
            }
        }

        pdf.save('invoice.pdf');
    };

    const viewCashVan = () => {
        navigate('/cashvan', { state: state });
    };
    const totalSum = items.reduce((acc, item) => acc + Number(item.totalValue), 0);

    return (
        <>
            <div
                ref={invoiceRef}
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '10mm 2mm',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    margin: 'auto'
                }}
            >

                <center style={{ fontWeight: 'bold' }}>BON DE LIVRAISON<br /><br /></center>
                <TableContainer component={Paper} sx={{ flexGrow: 1, fontSize: '21px' }}>
                    <Table sx={{
                        minWidth: 650,
                        // minHeight: 900, 
                        '& .MuiTableCell-root': {
                            border: '1px solid',
                            verticalAlign: 'top',
                            padding: '5px',
                        },
                        fontSize: '21px'
                    }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell rowSpan={3} colSpan={4} style={{ whiteSpace: 'nowrap' }}>
                                    <strong>Societe Azima Sarl</strong><br />
                                    LOT 06 F 160 MAHAZOARIVO SUD ANSIRABE I<br />
                                    Madagascar<br />
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Invoice No.<br /><strong>{invoicelabel}</strong></TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} colSpan={2}>Dated<br /><strong>{date} at {time}</strong></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ width: '40%' }}>Delivery Note</TableCell>
                                <TableCell colSpan={2} sx={{ width: '60%' }}>Mode/Terms of Payment</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2} sx={{ width: '40%' }}>Reference No. & Date</TableCell>
                                <TableCell colSpan={2} sx={{ width: '60%' }}>Other References</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell
                                    style={{ whiteSpace: 'nowrap' }}
                                    rowSpan={4}
                                    colSpan={4}
                                    sx={{ width: '40%' }}
                                >
                                    Buyer (Bill to)<br />
                                    <strong>{shopName}</strong><br />
                                    {location}<br />
                                    Mob No {noMobile}<br />
                                    {name} Client <br />
                                </TableCell>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Buyer's Order No.</TableCell>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Dated</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Dispatch Doc No.</TableCell>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Delivery Note Date</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Dispatched through</TableCell>
                                <TableCell colSpan={2} sx={{ width: '30%' }}>Destination</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={4} style={{ paddingBottom: '50px' }}>Terms of Delivery</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ width: '5%', fontWeight: 'bold', textAlign: 'center' }}>No.</TableCell>
                                <TableCell colSpan={3} style={{ width: '90%', fontWeight: 'bold', textAlign: 'left' }}>Description of Goods</TableCell>
                                <TableCell style={{ width: '9%', fontWeight: 'bold', textAlign: 'center', }}>Pkgs</TableCell>
                                <TableCell style={{ width: '9%', fontWeight: 'bold', textAlign: 'center', }}>Qty</TableCell>
                                <TableCell style={{ width: '50%', fontWeight: 'bold', textAlign: 'center' }}>Rate</TableCell>
                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                            </TableRow>
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    {+item.sacNumber !== 0 && +item.priceSac !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Sac</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.sacNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.priceSac)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.totalSacValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.cartonNumber !== 0 && +item.priceCarton !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Ctn</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.cartonNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.priceCarton)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.totalCtnsValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.boxNumber !== 0 && +item.priceBox !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Pqt</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.boxNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.priceBox)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.totalBoxValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.itemNumber !== 0 && +item.priceItem !== 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Pcs</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.itemNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.priceItem)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.totalItemValue)}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.bottleNumber !== 0 && +item.priceBottle !== 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Btl</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.bottleNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.priceBottle)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.totalBottleValue)}</TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                            {Array.isArray(promotions) && promotions.length > 0 && promotions.map((item, index) => (
                                <React.Fragment key={index}>
                                    {+item.sacNumber !== 0 && +item.priceSac !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Sac</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.sacNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.priceSac}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.totalSacValue}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.cartonNumber !== 0 && +item.priceCarton !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Ctn</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.cartonNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.priceCarton}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.totalCtnsValue}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.boxNumber !== 0 && +item.priceBox !== 0 && (
                                        <TableRow>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Pqt</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.boxNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.priceBox}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.totalBoxValue}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.itemNumber !== 0 && +item.priceItem !== 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Pcs</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{formaterNombre(item.itemNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.priceItem}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.totalItemValue}</TableCell>
                                        </TableRow>
                                    )}
                                    {+item.bottleNumber !== 0 && +item.priceBottle !== 0 && (
                                        <TableRow key={index}>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>{lineNumber++}</TableCell>
                                            <TableCell colSpan={3} style={{ borderTop: 'none', borderBottom: 'none', padding: '1px' }}>{item.brand}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'center', padding: '1px' }}>Btl</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{formaterNombre(item.bottleNumber)}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.priceBottle}</TableCell>
                                            <TableCell style={{ borderTop: 'none', borderBottom: 'none', textAlign: 'right', padding: '1px' }}>{item.totalBottleValue}</TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}

                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell colSpan={5}></TableCell>
                                <TableCell style={{ textAlign: 'right', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Ar {formaterNombre(totalSum)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table sx={{
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                            border: '1px solid',
                            verticalAlign: 'top',
                            padding: '5px',
                        },
                        fontSize: '21px'
                    }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} style={{ paddingBottom: '100px' }}>Amount Chargeable (in words)
                                    <AmountInWords amount={totalSum} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1}>Mode/Terms of Payment</TableCell>
                                <TableCell colSpan={1}>
                                    {paymentType === 'credit' && 'Credit'}
                                    {paymentType === 'cash' && 'Cash'}
                                    {paymentType === 'both' && (
                                        <>
                                            Credit and Cash
                                            <br />
                                            <strong>Cash: </strong>Ar {formaterNombre(cashAmount)}
                                            <br />
                                            <strong>Credit: </strong>Ar {formaterNombre(creditAmount)}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>Remarks: <br />{remarks}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width='50%'>Declaration<br />We declare that this invoice shows the actual price
                                    of the goods described and that all particulars are true and correct.</TableCell>
                                <TableCell width='50%'><p style={{ textAlign: 'right' }}><strong>for Societe Azima Sarl</strong></p>
                                    <p style={{ verticalAlign: 'bottom', textAlign: 'right' }}>Authorised Signatory</p></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <p style={{ textAlign: 'center' }}>This is a Computer Generated Invoice</p>
            </div>
            <center>
                <Button variant="outlined" onClick={generatePdf}>Export PDF</Button>
                <Button sx={{ ml: 5 }} variant="outlined" onClick={viewCashVan}>CASH VAN</Button>
            </center>
            <br /><br />
            <center>
                <TextField id="remarks" label="Remarks" variant="outlined" name="remarks"
                    onChange={(event) => { setRemarks(event.target.value) }} value={remarks}
                />
            </center>
        </>

    );
};

export default ExporterBon;