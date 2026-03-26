import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, TextField, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { fetchPurchaseLists } from '../PURCHASE/ApiPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import ExportBrandwiseToExcel from '../../ExportBrandwiseToExcel';
import formaterNombre from '../../formaterNombre';
const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const SalesTable = ({ filteredData, startDate,endDate}) => {
    const formatter = new Intl.NumberFormat('fr-FR');
    const filterMonthsBetweenDates = (startDate, endDate) => {
  
        if (startDate==='' || endDate==='') {
            return months;
        }
     
        const start = new Date(startDate);
        const end = new Date(endDate);   
    
        const startMonth = start.getMonth();
        const endMonth = end.getMonth();
        
        return months.slice(startMonth, endMonth + 1);
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
            const shopName = item.invoice.Shop.ShopName;
    
            if (!result[shopName]) {
                result[shopName] = {
                    CartonNumber: Array(filteredMonths.length).fill(0),
                    BoxNumber: Array(filteredMonths.length).fill(0),
                    ItemNumber: Array(filteredMonths.length).fill(0),
                    SacNumber : Array(filteredMonths.length).fill(0),
                    Totalctnsvalue: Array(filteredMonths.length).fill(0),
                    Totalboxvalue: Array(filteredMonths.length).fill(0),
                    Totalitemvalue: Array(filteredMonths.length).fill(0),
                    Totalsacvalue: Array(filteredMonths.length).fill(0),
                };
            }
    
            const date = new Date(item.invoice.date);
            const month = date.getMonth(); 
    
        
            if (month in monthIndices) {
                const filteredMonthIndex = monthIndices[month]; 
                    result[shopName].CartonNumber[filteredMonthIndex] += parseInt(item.CartonNumber, 10);
                    result[shopName].BoxNumber[filteredMonthIndex] += parseInt(item.BoxNumber, 10);
                    result[shopName].ItemNumber[filteredMonthIndex] += parseInt(item.ItemNumber, 10);
                    result[shopName].SacNumber[filteredMonthIndex] += parseInt(item.SacNumber, 10);
                    result[shopName].Totalctnsvalue[filteredMonthIndex] += parseInt(item.Totalctnsvalue, 10);
                    result[shopName].Totalboxvalue[filteredMonthIndex] += parseInt(item.Totalboxvalue, 10);
                    result[shopName].Totalitemvalue[filteredMonthIndex] += parseInt(item.Totalitemvalue, 10);
                    result[shopName].Totalsacvalue[filteredMonthIndex] += parseInt(item.Totalsacvalue, 10);

            }
        });
    
        return result;
    }, [filteredData,  filteredMonths]);
    



    return (
        <>
         <ExportBrandwiseToExcel Nombouton="Export to excell" fileName="Shopwise" data={groupedData} months={filteredMonths} isShopwise={true}/>
       
        <TableContainer component={Paper} sx={{ border: '2px solid black' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                }, }}>Shop Name</TableCell>
                        {filteredMonths.map((month, index) => (
                            <TableCell key={index} colSpan={2} sx={{ border: '2px solid black', textAlign: 'center' }}>{month}</TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{  position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                },}}></TableCell>
                        {filteredMonths.map((_, index) => (
                            <React.Fragment key={index}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Quantity</TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Total value</TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(groupedData).map(([shopName,{ CartonNumber, BoxNumber,SacNumber,ItemNumber,Totalctnsvalue, Totalboxvalue, Totalitemvalue, Totalsacvalue }]) => (
                         <React.Fragment key={shopName} >
                         <TableRow >
                              <TableCell sx={{  position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                },}}>{shopName}</TableCell>
                              {CartonNumber.map((cartnNb, monthIndex) => (
                                  <React.Fragment key={monthIndex}>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: cartnNb === 0 ? 'red' : 'blue' }}>{formaterNombre(cartnNb) } Crtn </span>
                                      </TableCell>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: Totalctnsvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalctnsvalue[monthIndex])}</span>
                                      </TableCell>
                                  </React.Fragment>
                              ))}
                          </TableRow>
                          <TableRow >
                              <TableCell sx={{ position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                }, }}>{shopName}</TableCell>
                              {BoxNumber.map((boxNb, monthIndex) => (
                                  <React.Fragment key={monthIndex}>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: boxNb === 0 ? 'red' : 'blue' }}>{formaterNombre(boxNb) } Pqt </span>
                                      </TableCell>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: Totalboxvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalboxvalue[monthIndex])}</span>
                                      </TableCell>
                                  </React.Fragment>
                              ))}
                          </TableRow>
                          <TableRow>
                              <TableCell sx={{  position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                }, }}>{shopName}</TableCell>
                              {ItemNumber.map((ItemNb, monthIndex) => (
                                  <React.Fragment key={monthIndex}>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: ItemNb === 0 ? 'red' : 'blue' }}>{formaterNombre(ItemNb) } Pcs </span>
                                      </TableCell>
                                      <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                          <span style={{ color: Totalitemvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalitemvalue[monthIndex])}</span>
                                      </TableCell>
                                  </React.Fragment>
                              ))}
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{  position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'white',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                borderLeft: '1px solid black', // Bordure à gauche
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
                                }, }}>{shopName}</TableCell>
                            {SacNumber.map((SacNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: SacNb === 0 ? 'red' : 'blue' }}>{formaterNombre(SacNb) } Sac </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalsacvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalsacvalue[monthIndex])}</span>
                                    </TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </React.Fragment>
                      ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
};

const Shopwise = () => {
    document.title = "Shopwise";
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedName, setSelectedName] = useState('');
    const [selectedShopName, setSelectedShopName] = useState('');
    const [loading, setLoading] = useState(false);
    const [filterDate1, setFilterDate1] = useState('');
    const [filterDate2, setFilterDate2] = useState('');

    const handleFilterDate1Change = (e) => {
        setFilterDate1(e.target.value);
      };
      const handleFilterDate2Change = (e) => {
        setFilterDate2(e.target.value);
      };

    useEffect(() => {
        setLoading(true);
        const loadSalesData = async () => {
            const data = await fetchPurchaseLists();
            setSalesData(data);
            setFilteredData(data); // Initially set filtered data to all sales data
        };

        loadSalesData();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        const filtered = salesData.filter(item => {
            const date = new Date(item.invoice.date);
            const year = date.getFullYear();
            const startDate = new Date(filterDate1);
            const endDate = new Date(filterDate2);
            return (
                (selectedBrand === '' || item.IdBrand.Brand === selectedBrand) &&
                (selectedYear === '' || year === selectedYear) &&
                (selectedShopName === '' || item.invoice.Shop.ShopName === selectedShopName) &&
                (selectedName === '' || item.invoice.Sales.Name === selectedName) && 
                ((filterDate1 ==='' || filterDate2==='')|| (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()))
            );
        });
        setFilteredData(filtered);
        setLoading(false);
    }, [salesData, selectedBrand, selectedYear, selectedName,selectedShopName,filterDate1,filterDate2]);

    const uniqueBrands = useMemo(() => {
        const brands = [...new Set(salesData.map(item => item.IdBrand.Brand))];
        return brands;
    }, [salesData]);

    const uniqueYears = useMemo(() => {
        const years = [...new Set(salesData.map(item => new Date(item.invoice.date).getFullYear()))];
        return years;
    }, [salesData]);

    const uniqueNames = useMemo(() => {
        const names = [...new Set(salesData.map(item => item.invoice.Sales.Name))];
        return names;
    }, [salesData]);

    const uniqueShopNames = useMemo(() => {
        const shops = [...new Set(salesData.map(item => item.invoice.Shop.ShopName))];
        return shops;
    }, [salesData]);



    return (
        <LayoutAdmin>
            {loading ? (
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
            <div>
                <h1>SHOPWISE</h1>
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Autocomplete
                        options={uniqueShopNames}
                        value={selectedShopName || ''}
                        onChange={(event, newValue) => setSelectedShopName(newValue || '')}
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
                        options={uniqueYears}
                        value={selectedYear || ''}
                        onChange={(event, newValue) => setSelectedYear(newValue || '')}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Year" 
                                variant="outlined" 
                                InputProps={{ 
                                    ...params.InputProps, 
                                    style: { whiteSpace: 'nowrap', minWidth: '120px' } 
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
                   
                    <TextField
                            size="small"
                            variant="outlined"
                            label="Date 1"
                            fullWidth
                            type="date"
                            value={filterDate1}
                            onChange={handleFilterDate1Change}
                            sx={{ mb: 3 }}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    <TextField
                            size="small"
                            variant="outlined"
                            label="Date 2"
                            fullWidth
                            type="date"
                            value={filterDate2}
                            onChange={handleFilterDate2Change}
                            sx={{ mb: 3 }}
                            InputLabelProps={{ shrink: true }}
                            required
                    />
                </Box>
                <SalesTable filteredData={filteredData}  startDate={filterDate1} endDate={filterDate2}/>
            </div>
        )}
        </LayoutAdmin>
    );
};

export default Shopwise;