import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Autocomplete, TextField, Select, MenuItem, Backdrop, CircularProgress, TablePagination } from '@mui/material';
import { fetchPurchaseLists } from '../PURCHASE/ApiPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import formaterNombre from '../../formaterNombre';
import { m } from 'framer-motion';
import ExportGroupedShop from '../../ExportGroupedShop';

function compterTotalMois(groupedData) {
    const totalMois = Array(12).fill(0);

    for (const categorie of Object.values(groupedData)) {
        for (const metrique of Object.values(categorie)) {
            for (let mois = 0; mois < 12; mois++) {
                totalMois[mois] += metrique[mois] || 0;
            }
        }
    }

    return totalMois;
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

function totalyear(total) {
    let res = 0;
    for (let i = 0; i < total.length; i++) {
        res += total[i];
    }
    return res;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const SalesTable = ({ filteredData, displayType, startDate, endDate }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const formatter = new Intl.NumberFormat('fr-FR');
    const filterMonthsBetweenDates = (startDate, endDate) => {

        if (startDate === '' || endDate === '') {
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
                    firstMetric: Array(filteredMonths.length).fill(0),
                    secondMetric: Array(filteredMonths.length).fill(0),
                    thirdMetric: Array(filteredMonths.length).fill(0),
                    fourthMetric: Array(filteredMonths.length).fill(0),
                    fifthMetric: Array(filteredMonths.length).fill(0),
                };
            }

            const date = new Date(item.invoice.date);
            const month = date.getMonth();

            if (month in monthIndices) {
                const filteredMonthIndex = monthIndices[month];

                if (displayType === 'number') {
                    result[brand].firstMetric[filteredMonthIndex] += parseInt(item.CartonNumber, 10);
                    result[brand].secondMetric[filteredMonthIndex] += parseInt(item.BoxNumber, 10);
                    result[brand].thirdMetric[filteredMonthIndex] += parseInt(item.ItemNumber, 10);
                    result[brand].fourthMetric[filteredMonthIndex] += parseInt(item.SacNumber, 10);
                    result[brand].fifthMetric[filteredMonthIndex] += parseInt(item.BottleNumber, 10);
                } else {
                    result[brand].firstMetric[filteredMonthIndex] += parseInt(item.Totalctnsvalue, 10);
                    result[brand].secondMetric[filteredMonthIndex] += parseInt(item.Totalboxvalue, 10);
                    result[brand].thirdMetric[filteredMonthIndex] += parseInt(item.Totalitemvalue, 10);
                    result[brand].fourthMetric[filteredMonthIndex] += parseInt(item.Totalsacvalue, 10);
                    result[brand].fifthMetric[filteredMonthIndex] += parseInt(item.Totalbottlevalue, 10);
                }
            }
        });

        return result;
    }, [filteredData, displayType, filteredMonths]);

    //compterMetric("metric",groupedData);

    //console.log("RES:", calculerTotauxParMetrique(groupedData));

    const totalMetrics = calculerTotauxParMetrique(groupedData);

    const total = compterTotalMois(groupedData)

    const total_year = totalyear(total)

    const type = displayType === 'number' ? "quantity" : "Ar"

    const headers = displayType === 'number' ?
        ['Number of carton', 'Number of packets ', 'Number of piece', 'Number of sac', 'Number of bottle'] :
        ['Total Ctns Value', 'Total packets  Value', 'Total Piece Value', 'Total Sac Value', 'Total Bottle Value'];

    return (

        <>
            <h5>Total Year: {formaterNombre(total_year)} {type}</h5>
            <ExportGroupedShop Nombouton="Export to excell" fileName="GroupedBrandwise" data={groupedData} months={filteredMonths} isShopwise={false} />

            <TableContainer component={Paper} sx={{ border: '2px solid black' }}>
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
                            }}>Brand</TableCell>
                            {filteredMonths.map((month, index) => (
                                <TableCell key={index} colSpan={5} sx={{ border: '2px solid black', textAlign: 'center' }}>{month}: <strong>{formaterNombre(total[index])}</strong></TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{
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
                            }}></TableCell>
                            {filteredMonths.map((_, index) => (
                                <React.Fragment key={index}>
                                    {headers.map((header, i) => (
                                        <TableCell key={i} sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                    {/* <TableCell sx={{
                                        border: '2px solid black',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        backgroundColor: '#f5f5f5'
                                    }}>Total</TableCell> */}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedData).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([brand, { firstMetric, secondMetric, thirdMetric, fourthMetric, fifthMetric }]) => (
                            <TableRow key={brand}>
                                <TableCell sx={{
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
                                }}>{brand}</TableCell>
                                {firstMetric.map((metricValue, monthIndex) => (
                                    <React.Fragment key={monthIndex}>
                                        <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            <span style={{ color: metricValue === 0 ? 'red' : 'blue' }}>
                                                {formaterNombre(metricValue)}
                                            </span>
                                        </TableCell>
                                        <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            <span style={{ color: secondMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                                {formaterNombre(secondMetric[monthIndex])}
                                            </span>
                                        </TableCell>
                                        <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            <span style={{ color: thirdMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                                {formaterNombre(thirdMetric[monthIndex])}
                                            </span>
                                        </TableCell>
                                        <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            <span style={{ color: fourthMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                                {formaterNombre(fourthMetric[monthIndex])}
                                            </span>
                                        </TableCell>
                                        <TableCell sx={{ border: '2px solid black', textAlign: 'center' }}>
                                            <span style={{ color: fifthMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                                {formaterNombre(fifthMetric[monthIndex])}
                                            </span>
                                        </TableCell>
                                        {/* <TableCell sx={{
                                            border: '2px solid black',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            backgroundColor: '#f5f5f5'
                                        }}>
                                            {formaterNombre(
                                                metricValue +
                                                secondMetric[monthIndex] +
                                                thirdMetric[monthIndex] +
                                                fourthMetric[monthIndex] +
                                                fifthMetric[monthIndex]
                                            )}
                                        </TableCell> */}
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{
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
                            }}>TOTAL</TableCell>

                            {totalMetrics.firstMetric.map((_, monthIndex) => (
                                <React.Fragment key={monthIndex}>
                                    <TableCell sx={{ backgroundColor: 'yellow', border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                                        <span style={{ color: totalMetrics.firstMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                            {formaterNombre(totalMetrics.firstMetric[monthIndex])}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: 'yellow', border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                                        <span style={{ color: totalMetrics.secondMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                            {formaterNombre(totalMetrics.secondMetric[monthIndex])}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: 'yellow', border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                                        <span style={{ color: totalMetrics.thirdMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                            {formaterNombre(totalMetrics.thirdMetric[monthIndex])}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: 'yellow', border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                                        <span style={{ color: totalMetrics.fourthMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                            {formaterNombre(totalMetrics.fourthMetric[monthIndex])}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: 'yellow', border: '2px solid black', textAlign: 'center', fontWeight: 'bold' }}>
                                        <span style={{ color: totalMetrics.fifthMetric[monthIndex] === 0 ? 'red' : 'blue' }}>
                                            {formaterNombre(totalMetrics.fifthMetric[monthIndex])}
                                        </span>
                                    </TableCell>
                                    {/* <TableCell sx={{
                                        backgroundColor: 'yellow', border: '2px solid black',
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {formaterNombre(
                                            totalMetrics.firstMetric[monthIndex] +
                                            totalMetrics.secondMetric[monthIndex] +
                                            totalMetrics.thirdMetric[monthIndex] +
                                            totalMetrics.fourthMetric[monthIndex] +
                                            totalMetrics.fifthMetric[monthIndex]
                                        )}
                                    </TableCell> */}
                                </React.Fragment>
                            ))}
                        </TableRow>

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

const GroupedBrandwise = () => {
    document.title = "Grouped Brandwise";
    const [salesData, setSalesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedShopName, setSelectedShopName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [displayType, setDisplayType] = useState('number');
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
            return (
                (selectedName === '' || item.invoice.Sales.Name === selectedName) && // Utilisation de item.invoice.Sales.Name
                (selectedYear === '' || year === parseInt(selectedYear, 10)) &&
                (selectedShopName === '' || item.invoice.Shop.ShopName === selectedShopName) &&
                (selectedBrand === '' || item.IdBrand.Brand === selectedBrand) &&
                ((filterDate1 === '' || filterDate2 === '') || (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()))
            );
        });
        setFilteredData(filtered);
        setLoading(false);
    }, [salesData, selectedName, selectedYear, selectedShopName, selectedBrand, filterDate1, filterDate2]);

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
                    <h1>GROUPED BRANDWISE</h1>
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
                        <Select
                            value={displayType}
                            onChange={(event) => setDisplayType(event.target.value)}
                            sx={{ minWidth: 180 }}
                        >
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="value">Value</MenuItem>
                        </Select>
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
                    <SalesTable filteredData={filteredData} displayType={displayType} startDate={filterDate1} endDate={filterDate2} />
                </div>
            )}
        </LayoutAdmin>
    );
};

export default GroupedBrandwise;