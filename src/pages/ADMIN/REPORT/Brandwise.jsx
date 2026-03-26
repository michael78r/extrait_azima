import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, TextField, Backdrop, CircularProgress,Button } from '@mui/material';
import { fetchPurchaseLists } from '../PURCHASE/ApiPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import ExportBrandwiseToExcel from '../../ExportBrandwiseToExcel';
import { useNavigate } from 'react-router-dom';
import formaterNombre from '../../formaterNombre';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const SalesTable = ({ filteredData,startDate,endDate}) => {
    // const formatter = new Intl.NumberFormat('fr-FR');

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
    
    //Filtrer les mois entre deux dates
    const filteredMonths = filterMonthsBetweenDates(startDate, endDate);
    
    const groupedData = useMemo(() => {
        const result = {};
    
        const monthIndices = filteredMonths.reduce((acc, monthName, index) => {
            const monthIndex = months.indexOf(monthName); 
            acc[monthIndex] = index;
            return acc;
        }, {});
    
        filteredData.forEach((item) => {
            const brand = item.IdBrand.Brand;
    
            if (!result[brand]) {
                result[brand] = {
                    CartonNumber: Array(filteredMonths.length).fill(0),
                    BoxNumber: Array(filteredMonths.length).fill(0),
                    ItemNumber: Array(filteredMonths.length).fill(0),
                    SacNumber : Array(filteredMonths.length).fill(0),
                    BottleNumber : Array(filteredMonths.length).fill(0),
                    Totalctnsvalue: Array(filteredMonths.length).fill(0),
                    Totalboxvalue: Array(filteredMonths.length).fill(0),
                    Totalitemvalue: Array(filteredMonths.length).fill(0),
                    Totalsacvalue: Array(filteredMonths.length).fill(0),
                    Totalbottlevalue: Array(filteredMonths.length).fill(0),
                    PriceCtn : Array(filteredMonths.length).fill(0),
                    PriceBox : Array(filteredMonths.length).fill(0),
                    PriceItem : Array(filteredMonths.length).fill(0),
                    PriceSac : Array(filteredMonths.length).fill(0),
                    PriceBottle : Array(filteredMonths.length).fill(0)
                };
            }
    
            const date = new Date(item.invoice.date);
            const month = date.getMonth(); 
    
            if (month in monthIndices) {
                    const filteredMonthIndex = monthIndices[month]; 
                    result[brand].CartonNumber[filteredMonthIndex] += parseInt(item.CartonNumber, 10);
                    result[brand].BoxNumber[filteredMonthIndex] += parseInt(item.BoxNumber, 10);
                    result[brand].ItemNumber[filteredMonthIndex] += parseInt(item.ItemNumber, 10);
                    result[brand].SacNumber[filteredMonthIndex] += parseInt(item.SacNumber, 10);
                    result[brand].BottleNumber[filteredMonthIndex] += parseInt(item.BottleNumber, 10);
                    result[brand].Totalctnsvalue[filteredMonthIndex] += parseInt(item.Totalctnsvalue, 10);
                    result[brand].Totalboxvalue[filteredMonthIndex] += parseInt(item.Totalboxvalue, 10);
                    result[brand].Totalitemvalue[filteredMonthIndex] += parseInt(item.Totalitemvalue, 10);
                    result[brand].Totalsacvalue[filteredMonthIndex] += parseInt(item.Totalsacvalue, 10);
                    result[brand].Totalbottlevalue[filteredMonthIndex] += parseInt(item.Totalbottlevalue, 10);
                    result[brand].PriceCtn[filteredMonthIndex] = item.IdBrand.Pricectns;
                    result[brand].PriceBox[filteredMonthIndex] = item.IdBrand.Pricebox;
                    result[brand].PriceItem[filteredMonthIndex] = item.IdBrand.Priceitem;
                    result[brand].PriceSac[filteredMonthIndex] = item.IdBrand.Pricesac;
                    result[brand].PriceBottle[filteredMonthIndex] = item.IdBrand.Pricebottle;
            }
        });
    
        return result;
    }, [filteredData, filteredMonths]);


    
    const navigate = useNavigate();


    return (
        <>
         <Button
         onClick={() =>{navigate(`/todayreport`)}}
         variant="contained" sx={{ mr : 10}}>
            Today report
        </Button>
       <ExportBrandwiseToExcel Nombouton="Export to excell" fileName="Brandwise" data={groupedData} months={filteredMonths} isShopwise={false}/>
      
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
                        {filteredMonths.map((month, index) => (
                            <TableCell key={index} colSpan={3} sx={{ border: '2px solid black', textAlign: 'center' }}>{month}</TableCell>
                        ))}
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
                        {filteredMonths.map((_, index) => (
                            <React.Fragment key={index}>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Quantity</TableCell>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Value</TableCell>
                                <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>Total value</TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(groupedData).map(([brand, { CartonNumber, BoxNumber, ItemNumber,SacNumber,BottleNumber,Totalctnsvalue, Totalboxvalue, Totalitemvalue,Totalsacvalue,Totalbottlevalue,PriceItem,PriceBox,PriceCtn,PriceSac,PriceBottle }]) => (
                        <React.Fragment key={brand} >
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
                            {CartonNumber.map((cartnNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: cartnNb === 0 ? 'red' : 'blue' }}>{formaterNombre(cartnNb) } Ctn </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: cartnNb === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceCtn[monthIndex])}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalctnsvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalctnsvalue[monthIndex])}</span>
                                    </TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
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
                            {BoxNumber.map((boxNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: boxNb === 0 ? 'red' : 'blue' }}>{formaterNombre(boxNb) } Pqt </span>
                                    </TableCell>
                                     <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: boxNb === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceBox[monthIndex])}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalboxvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalboxvalue[monthIndex])}</span>
                                    </TableCell>
                                </React.Fragment>
                            ))}
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
                                }, }}>{brand}</TableCell>
                            {ItemNumber.map((ItemNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: ItemNb === 0 ? 'red' : 'blue' }}>{formaterNombre(ItemNb) } Pcs </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: ItemNb === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceItem[monthIndex])}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalitemvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalitemvalue[monthIndex])}</span>
                                    </TableCell>
                                </React.Fragment>
                            ))}
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
                                },}}>{brand}</TableCell>
                            {SacNumber.map((SacNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: SacNb === 0 ? 'red' : 'blue' }}>{formaterNombre(SacNb) } Sac </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: SacNb === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceSac[monthIndex])}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalsacvalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalsacvalue[monthIndex])}</span>
                                    </TableCell>
                                </React.Fragment>
                            ))}
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
                                },}}>{brand}</TableCell>
                            {SacNumber.map((BtlNb, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: BtlNb === 0 ? 'red' : 'blue' }}>{formaterNombre(BtlNb) } Btl </span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: BtlNb === 0 ? 'red' : 'blue' }}>{formaterNombre(PriceBottle[monthIndex])}</span>
                                    </TableCell>
                                    <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                        <span style={{ color: Totalbottlevalue[monthIndex] === 0 ? 'red' : 'blue' }}>{formaterNombre(Totalbottlevalue[monthIndex])}</span>
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

const Brandwise = () => {
    document.title = "Brandwise";
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedShopName, setSelectedShopName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

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
            const year = date.getFullYear();
            const startDate = new Date(filterDate1);
            const endDate = new Date(filterDate2);
            endDate.setHours(23, 59, 59, 999);
            return (
                (selectedName === '' || item.invoice.Sales.Name === selectedName) && // Utilisation de item.invoice.Sales.Name
                (selectedYear === '' || year === parseInt(selectedYear, 10)) &&
                (selectedShopName === '' || item.invoice.Shop.ShopName === selectedShopName) &&
                (selectedBrand === '' || item.IdBrand.Brand === selectedBrand) && 
                ((filterDate1 ==='' || filterDate2==='')|| (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()))
            );
        });
        setFilteredData(filtered);
        setLoading(false);
    }, [salesData, selectedName, selectedYear, selectedShopName, selectedBrand,filterDate1,filterDate2]);
    

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
                 
                <SalesTable filteredData={filteredData}  startDate={filterDate1} endDate={filterDate2} />
            </div>
        )}
        </LayoutAdmin>
    );
};

export default Brandwise;