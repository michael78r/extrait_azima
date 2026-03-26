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
import { fetchAllPurchaseLists } from '../PURCHASE/ApiAllPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import formaterNombre from '../../formaterNombre';

function compterTotalMois(groupedData) {
  const totalMois = Array(12).fill(0);

  for (const categorie of Object.values(groupedData)) {
    for (const metrique of Object.values(categorie)) {
      for (let mois = 0; mois < 12; mois++) {
        if (metrique[mois] !== undefined) {
          totalMois[mois] += metrique[mois] || 0;
          // totalMois[mois] += parseInt(metrique[mois]) || 1;
          // console.log(metrique[0]);
        }
      }
    }
  }

  return totalMois;
}

function calculerSommes(tableaux) {
  return tableaux.map((ligne, index) => {
    const str = typeof ligne === 'string' ? ligne : String(ligne);
    const somme = str
      .split(',')
      .map(n => parseInt(n, 10))
      .reduce((acc, val) => acc + val, 0);
    return `indice ${index}: ${somme}`;
  });
}


function totalyear(total) {
  let res = 0;
  for (let i = 0; i < total.length; i++) {
    res += total[i];
  }
  return res;
}

function calculerTotauxParMetrique(data) {
  const totaux = {
    firstMetric: Array(12).fill(0),
    secondMetric: Array(12).fill(0),
    thirdMetric: Array(12).fill(0),
    fourthMetric: Array(12).fill(0),
    fifthMetric: Array(12).fill(0)
  };

  // Parcourir tous les produits
  for (const produit of Object.values(data)) {
    // Pour chaque métrique du produit
    for (const [metrique, valeurs] of Object.entries(produit)) {
      // Ajouter chaque valeur mensuelle au total correspondant
      for (let mois = 0; mois < 12; mois++) {
        totaux[metrique][mois] += valeurs[mois] || 0;
      }
    }
  }

  return totaux;
}
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

  const type = displayType === 'number' ? "quantity" : "Ar"


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
      const data = await fetchAllPurchaseLists();
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