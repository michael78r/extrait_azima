import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, TextField, Select, MenuItem, Backdrop, CircularProgress,Button } from '@mui/material';
import { fetchPurchaseLists } from '../PURCHASE/ApiPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import ExportBrandwiseToExcel from '../../ExportBrandwiseToExcel';
import formaterNombre from '../../formaterNombre';
const SalesTable = ({ filteredData}) => {
    const formatter = new Intl.NumberFormat('fr-FR');
    const groupedData = useMemo(() => {
        const result = {};
      
        filteredData.forEach((item) => {
          const brand = item.IdBrand.Brand;
      
          if (!result[brand]) {
            result[brand] = {
              CartonNumber: 0, // Valeur initiale
              BoxNumber: 0,
              ItemNumber: 0,
              SacNumber: 0,
              Totalctnsvalue: 0,
              Totalboxvalue: 0,
              Totalitemvalue: 0,
              Totalsacvalue: 0,
              PriceCtn: item.IdBrand.Pricectns,  
              PriceBox: item.IdBrand.Pricebox,
              PriceItem: item.IdBrand.Priceitem,
              PriceSac: item.IdBrand.Pricesac
            };
          }
      
         
          result[brand].CartonNumber += parseInt(item.CartonNumber, 10);
          result[brand].BoxNumber += parseInt(item.BoxNumber, 10);
          result[brand].ItemNumber += parseInt(item.ItemNumber, 10);
          result[brand].SacNumber += parseInt(item.SacNumber, 10);
          result[brand].Totalctnsvalue += parseInt(item.Totalctnsvalue, 10);
          result[brand].Totalboxvalue += parseInt(item.Totalboxvalue, 10);
          result[brand].Totalitemvalue += parseInt(item.Totalitemvalue, 10);
          result[brand].Totalsacvalue += parseInt(item.Totalsacvalue, 10);
        });
      
        return result;
      }, [filteredData]);

    return (
        <>
        <TableContainer component={Paper} sx={{ border: '2px solid black' , mt : '50px' }}>
           
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                                position: 'sticky',
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
                                },
                            }}>Brand</TableCell>
                       
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{   position: 'sticky',
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
                       
                            <React.Fragment >
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Quantity</TableCell>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Value</TableCell>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Total value</TableCell>
                            </React.Fragment>
                      
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(groupedData).map(([brand, { CartonNumber, BoxNumber, ItemNumber,SacNumber,Totalctnsvalue, Totalboxvalue, Totalitemvalue,Totalsacvalue,PriceItem,PriceBox,PriceCtn,PriceSac }]) => (
                        <React.Fragment key={brand} >
                        { CartonNumber >0 && (
                       <TableRow >
                            <TableCell sx={{   position: 'sticky',
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
                                },}}>{brand}</TableCell>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: CartonNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(CartonNumber) } Crtn </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: CartonNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceCtn)}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalctnsvalue === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalctnsvalue)}</span>
                                    </TableCell>
                        </TableRow>
                            )}
                        { BoxNumber >0 && (
                        <TableRow >
                            <TableCell sx={{   position: 'sticky',
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
                                },}}>{brand}</TableCell>

                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: BoxNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(BoxNumber) } pqt </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: BoxNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceBox)}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalboxvalue === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalboxvalue)}</span>
                                    </TableCell>
                     
                        </TableRow>
                        )}
                        { ItemNumber >0 && (
                        <TableRow>
                            <TableCell sx={{   position: 'sticky',
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
                                }, }}>{brand}</TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: ItemNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(ItemNumber) } Pcs </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: ItemNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceItem)}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalitemvalue === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalitemvalue)}</span>
                                    </TableCell>
                        </TableRow>
                        )}
                         { SacNumber >0 && (
                        <TableRow>
                            <TableCell sx={{   position: 'sticky',
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
                                },}}>{brand}</TableCell>
                        
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: SacNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(SacNumber) } Sac </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: SacNumber === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceSac)}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalsacvalue === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalsacvalue)}</span>
                                    </TableCell>
                        </TableRow>
                         )}
                  </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
};

const TodayReport = () => {
    document.title = "Today report ";
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedShopName, setSelectedShopName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSalesData = async () => {
            setLoading(true);
            const data = await fetchPurchaseLists();
            setSalesData(data);
            setFilteredData(data);
            setLoading(false);
        };
        loadSalesData();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        const filtered = salesData.filter(item => {
            const date = new Date(item.invoice.date); // Utilisation de item.invoice.date
            const startDate = new Date();
            const endDate = new Date();
            startDate.setHours(0,0,0,0);
            endDate.setHours(23, 59, 59, 999);
            return (
                (selectedName === '' || item.invoice.Sales.Name === selectedName) && // Utilisation de item.invoice.Sales.Name
                (selectedShopName === '' || item.invoice.Shop.ShopName === selectedShopName) &&
                (selectedBrand === '' || item.IdBrand.Brand === selectedBrand) && 
                ((date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()))
            );
        });
        setFilteredData(filtered);
        setLoading(false);
    }, [salesData, selectedName, selectedShopName, selectedBrand]);
    

    const uniqueYears = useMemo(() => {
        const years = [...new Set(salesData.map(item => new Date(item.invoice.date).getFullYear()))]; // Utilisation de item.invoice.date
        return years;
    }, [salesData]);

    const uniqueShopNames = useMemo(() => {
        const shops = [...new Set(salesData.map(item => item.invoice.Shop.ShopName))];
        return shops;
    }, [salesData]);

    const uniqueBrands = useMemo(() => {
        const brands = [...new Set(salesData.map(item => item.IdBrand.Brand))];
        return brands;
    }, [salesData]);

    const uniqueNames = useMemo(() => {
        const names = [...new Set(salesData.map(item => item.invoice.Sales.Name))];
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
                <h1>BRANDWISE</h1>
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
                </Box>
                 
                <SalesTable filteredData={filteredData}   />
            </div>
        )}
        </LayoutAdmin>
    );
};

export default TodayReport;