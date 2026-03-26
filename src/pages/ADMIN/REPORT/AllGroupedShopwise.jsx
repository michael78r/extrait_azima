import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
  TablePagination
} from '@mui/material';
// import { fetchAllPurchaseLists } from '../PURCHASE/ApiAllPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import formaterNombre from '../../formaterNombre';

const DATA = [{"purchase_id":105,"id_brand_id":21,"invoice_id":2234,"ItemNumber":0,"CartonNumber":20,"Totalitemvalue":0,"Totalctnsvalue":4596000,"Totalvalue":4596000,"BoxNumber":0,"Totalboxvalue":0,"SacNumber":0,"Totalsacvalue":0,"BottleNumber":0,"Totalbottlevalue":0,"id_brand_cashvan_id":0,"pricectn":229800,"pricesac":0,"pricebtl":0,"pricebox":11490,"priceitem":0,"id":701,"Brand":" Cahier Champion Pm 192pge (20pkt x 5pcs)","Pricectns":229800,"Pricebox":11490,"Priceitem":0,"Pricesac":0,"Pricebottle":0,"sales_id":2,"shop_id":701,"date":"2025-07-08 08:53:15","Label":"2025/JUL/LANTO/7","Amount":4596000,"Latitude":-18.960339188274,"Longitude":47.531877005858,"cashAmount":0,"creditAmount":4596000,"Name":"LANTO","Contact":"","Address":"","canSellCash":0,"isCashvan":0,"sales_men_id":2,"Section":"Analamahintsy","Location":"Analamahintsy","ShopName":"Armand - Analamahintsy","Phone":"033 12 354 72","CreditLimit":30,"CreditDays":3,"city_id":1,"nameManagerShop":"","longitude":"-","latitude":"-"},{"purchase_id":104,"id_brand_id":1,"invoice_id":2233,"ItemNumber":0,"CartonNumber":20,"Totalitemvalue":0,"Totalctnsvalue":2012800,"Totalvalue":2012800,"BoxNumber":0,"Totalboxvalue":0,"SacNumber":0,"Totalsacvalue":0,"BottleNumber":0,"Totalbottlevalue":0,"id_brand_cashvan_id":0,"pricectn":100640,"pricesac":0,"pricebtl":0,"pricebox":6290,"priceitem":0,"id":701,"Brand":" Bonjour LolliPop 14 Grm Ochra Max (48 Pcs X 16 Pkt)","Pricectns":100640,"Pricebox":6290,"Priceitem":0,"Pricesac":0,"Pricebottle":0,"sales_id":2,"shop_id":701,"date":"2025-07-08 08:52:50","Label":"2025/JUL/LANTO/6","Amount":2012800,"Latitude":-18.960339188274,"Longitude":47.531877005858,"cashAmount":0,"creditAmount":2012800,"Name":"LANTO","Contact":"","Address":"","canSellCash":0,"isCashvan":0,"sales_men_id":2,"Section":"Analamahintsy","Location":"Analamahintsy","ShopName":"Armand - Analamahintsy","Phone":"033 12 354 72","CreditLimit":30,"CreditDays":3,"city_id":1,"nameManagerShop":"","longitude":"-","latitude":"-"},{"purchase_id":103,"id_brand_id":56,"invoice_id":2232,"ItemNumber":0,"CartonNumber":20,"Totalitemvalue":0,"Totalctnsvalue":2400000,"Totalvalue":2400000,"BoxNumber":0,"Totalboxvalue":0,"SacNumber":0,"Totalsacvalue":0,"BottleNumber":0,"Totalbottlevalue":0,"id_brand_cashvan_id":0,"pricectn":120000,"pricesac":0,"pricebtl":0,"pricebox":0,"priceitem":550,"id":701,"Brand":"Milk Bonjour Powder (240 Pcs X 18 Grm)","Pricectns":120000,"Pricebox":0,"Priceitem":550,"Pricesac":0,"Pricebottle":0,"sales_id":2,"shop_id":701,"date":"2025-07-08 08:36:24","Label":"2025/JUL/LANTO/5","Amount":2400000,"Latitude":-18.960339188274,"Longitude":47.531877005858,"cashAmount":0,"creditAmount":2400000,"Name":"LANTO","Contact":"","Address":"","canSellCash":0,"isCashvan":0,"sales_men_id":2,"Section":"Analamahintsy","Location":"Analamahintsy","ShopName":"Armand - Analamahintsy","Phone":"033 12 354 72","CreditLimit":30,"CreditDays":3,"city_id":1,"nameManagerShop":"","longitude":"-","latitude":"-"}]

// function compterTotalMois(groupedData) {
//   const totalMois = Array(12).fill(0);

//   for (const categorie of Object.values(groupedData)) {
//     for (const metrique of Object.values(categorie)) {
//       for (let mois = 0; mois < 12; mois++) {
//         if (metrique[mois] !== undefined) {
//           totalMois[mois] += metrique[mois] || 0;
//           // totalMois[mois] += parseInt(metrique[mois]) || 1;
//           // console.log(metrique[0]);
//         }
//       }
//     }
//   }

//   return totalMois;
// }

// function calculerSommes(tableaux) {
//   return tableaux.map((ligne, index) => {
//     const str = typeof ligne === 'string' ? ligne : String(ligne);
//     const somme = str
//       .split(',')
//       .map(n => parseInt(n, 10))
//       .reduce((acc, val) => acc + val, 0);
//     return `indice ${index}: ${somme}`;
//   });
// }


// function totalyear(total) {
//   let res = 0;
//   for (let i = 0; i < total.length; i++) {
//     res += total[i];
//   }
//   return res;
// }

// function calculerTotauxParMetrique(data) {
//   const totaux = {
//     firstMetric: Array(12).fill(0),
//     secondMetric: Array(12).fill(0),
//     thirdMetric: Array(12).fill(0),
//     fourthMetric: Array(12).fill(0),
//     fifthMetric: Array(12).fill(0)
//   };

//   // Parcourir tous les produits
//   for (const produit of Object.values(data)) {
//     // Pour chaque métrique du produit
//     for (const [metrique, valeurs] of Object.entries(produit)) {
//       // Ajouter chaque valeur mensuelle au total correspondant
//       for (let mois = 0; mois < 12; mois++) {
//         totaux[metrique][mois] += valeurs[mois] || 0;
//       }
//     }
//   }

//   return totaux;
// }
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const stickyCellStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  backgroundColor: 'white',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  borderLeft: '1px solid black',
  borderTop: '1px solid black',
  borderBottom: '1px solid black',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '1px',
    backgroundColor: 'black',
  }
};

const SalesTable = ({ filteredData, displayType, startDate, endDate }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const filterMonthsBetweenDates = (startDate, endDate) => {
    if (startDate === '' || endDate === '') return months;

    const start = new Date(startDate);
    const end = new Date(endDate);
    return months.slice(start.getMonth(), end.getMonth() + 1);
  };

  const filteredMonths = filterMonthsBetweenDates(startDate, endDate);

  const groupedData = useMemo(() => {
    const result = {};
    const monthIndices = filteredMonths.reduce((acc, monthName, index) => {
      const monthIndex = months.indexOf(monthName);
      acc[monthIndex] = index;
      return acc;
    }, {});

    filteredData.forEach((item) => {
      const shopName = item.ShopName;

      if (!result[shopName]) {
        result[shopName] = {
          metrics: Array(5).fill().map(() => Array(filteredMonths.length).fill(0))
        };
      }

      const date = new Date(item.date);
      const month = date.getMonth();

      if (month in monthIndices) {
        const filteredMonthIndex = monthIndices[month];
        const metrics = result[shopName].metrics;

        if (displayType === 'number') {
          metrics[0][filteredMonthIndex] += parseInt(item.CartonNumber, 10);
          metrics[1][filteredMonthIndex] += parseInt(item.BoxNumber, 10);
          metrics[2][filteredMonthIndex] += parseInt(item.ItemNumber, 10);
          metrics[3][filteredMonthIndex] += parseInt(item.SacNumber, 10);
          metrics[4][filteredMonthIndex] += parseInt(item.BottleNumber, 10);
        } else {
          metrics[0][filteredMonthIndex] += parseInt(item.Totalctnsvalue, 10);
          metrics[1][filteredMonthIndex] += parseInt(item.Totalitemvalue, 10);
          metrics[2][filteredMonthIndex] += parseInt(item.Totalitemvalue, 10);
          metrics[3][filteredMonthIndex] += parseInt(item.Totalsacvalue, 10);
          metrics[4][filteredMonthIndex] += parseInt(item.Totalbottlevalue, 10);
        }
      }
    });

    return result;
  }, [filteredData, displayType, filteredMonths]);

  // console.log('filteredData', groupedData);

  // const total = compterTotalMois(groupedData)

  // const newTotal = calculerSommes(total)

  // console.log('total', newTotal);

  // const total_year = totalyear(total)

  // const type = displayType === 'number' ? "quantity" : "Ar"


  const headers = displayType === 'number'
    ? ['Number of carton', 'Number of packets', 'Number of piece', 'Number of sac', 'Number of bottle']
    : ['Total Ctns Value', 'Total packets Value', 'Total Piece Value', 'Total Sac Value', 'Total Bottle Value'];

  return (
    <>
      {/* <h5>Total Year: {formaterNombre(total_year)} {type}</h5> */}

      <TableContainer component={Paper} sx={{ border: '2px solid black' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={stickyCellStyle}>Shop Name</TableCell>
              {filteredMonths.map((month, index) => (
                <TableCell key={index} colSpan={5} sx={{ border: '2px solid black', textAlign: 'center' }}>{month}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={stickyCellStyle}></TableCell>
              {filteredMonths.map((_, index) => (
                <React.Fragment key={index}>
                  {headers.map((header, i) => (
                    <TableCell key={i} sx={{ border: '2px solid black', textAlign: 'center' }}>
                      {header}
                    </TableCell>
                  ))}
                  {/* <TableCell sx={{ border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>Total</TableCell> */}
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedData)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(([shopName, { metrics }]) => (
                <TableRow key={shopName}>
                  <TableCell sx={stickyCellStyle}>{shopName}</TableCell>
                  {filteredMonths.map((_, monthIndex) => (
                    <React.Fragment key={monthIndex}>
                      {metrics.map((metric, metricIndex) => (
                        <TableCell key={metricIndex} sx={{ border: '2px solid black', textAlign: 'center' }}>
                          <span style={{ color: metric[monthIndex] === 0 ? 'red' : 'blue' }}>
                            {formaterNombre(metric[monthIndex])}
                          </span>
                        </TableCell>
                      ))}
                      {/* <TableCell sx={{ border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                        {formaterNombre(
                          metrics.reduce((sum, metric) => sum + metric[monthIndex], 0)
                        )}
                      </TableCell> */}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={Object.keys(groupedData).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </>
  );
};

const AllGroupedShopwise = () => {
  document.title = "Shopwise";
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedShopName, setSelectedShopName] = useState('');
  const [displayType, setDisplayType] = useState('number');
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    setLoading(true);
    const loadSalesData = async () => {
      const data = DATA;
      setSalesData(data);
      setFilteredData(data);
      setLoading(false);
    };
    loadSalesData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const filtered = salesData.filter(item => {
      return (
        (selectedBrand === '' || item.Brand === selectedBrand) &&
        (selectedShopName === '' || item.ShopName === selectedShopName) &&
        (selectedName === '' || item.Name === selectedName)

      );
    });
    setFilteredData(filtered);
    setLoading(false);
  }, [salesData, selectedBrand, selectedName, selectedShopName]);

  // useEffect(() => {
  //   const filtered = salesData.filter(item =>
  //     selectedShopName === '' || item.ShopName === selectedShopName
  //   );
  //   setFilteredData(filtered);
  // }, [selectedShopName, salesData]);

  //console.log('filteredData', filteredData);

  const uniqueShopNames = useMemo(() =>
    [...new Set(salesData.map(item => item.ShopName))],
    [salesData]
  );

  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(salesData.map(item => item.Brand))];
    return brands;
  }, [salesData]);

  const uniqueNames = useMemo(() => {
    const names = [...new Set(salesData.map(item => item.Name))];
    return names;
  }, [salesData]);

  return (
    <LayoutAdmin>
      {loading ? (
        <Backdrop open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          <h1>ALL GROUPED SHOPWISE</h1>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Autocomplete
              options={uniqueShopNames}
              value={selectedShopName}
              onChange={(_, newValue) => setSelectedShopName(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shop Name"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    style: { whiteSpace: 'nowrap', minWidth: '150px' }
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <Autocomplete
              options={uniqueBrands}
              value={selectedBrand || ''}
              onChange={(event, newValue) => setSelectedBrand(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Brand"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    style: { whiteSpace: 'nowrap', minWidth: '150px' }
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <Autocomplete
              options={uniqueNames}
              value={selectedName || ''}
              onChange={(event, newValue) => setSelectedName(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sales man person name"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    style: { whiteSpace: 'nowrap', minWidth: '150px' }
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
            />
            <Select
              value={displayType}
              onChange={(e) => setDisplayType(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="value">Value</MenuItem>
            </Select>
          </Box>
          <SalesTable
            filteredData={filteredData}
            displayType={displayType}
            startDate=""
            endDate=""
          />
        </div>
      )}
    </LayoutAdmin>
  );
};

export default AllGroupedShopwise;