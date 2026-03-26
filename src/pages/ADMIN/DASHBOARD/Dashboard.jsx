import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { Container, Row, Col } from 'react-grid-system';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchPurchaseCount } from './ApiCountPurchases';
import { fetchPurchaseSum } from './ApiSumPurchases';
import { fetchPurchaseLists } from '../PURCHASE/ApiPurchaseLists';
import LayoutAdmin from '../../LayoutAdmin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Fonction pour convertir le numéro du mois en nom du mois
const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNumber, 10) - 1];
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Sales',
    },
  },
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [nopurchase, setNopurchase] = useState('');
  const [sumvalue, setSumvalue] = useState('');
  const [chartData, setChartData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const formatter = new Intl.NumberFormat('fr-FR');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countData, sumData, purchasedata] = await Promise.all([
          fetchPurchaseCount(),
          fetchPurchaseSum(),
          fetchPurchaseLists()
        ]);

        setNopurchase(countData);
        setSumvalue(sumData);

        // Regrouper les données par année et mois
        const groupedByYearMonth = purchasedata.reduce((acc, item) => {
          const date = new Date(item.Date);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const yearMonth = `${year}-${month}`;
          if (!acc[year]) {
            acc[year] = {};
          }
          if (!acc[year][month]) {
            acc[year][month] = 0;
          }
          acc[year][month] += parseFloat(item.Totalvalue);
          return acc;
        }, {});

        // Extraire les années disponibles
        const availableYears = Object.keys(groupedByYearMonth).sort();
        setYears(availableYears);

        // Créer une liste complète des mois
        const allMonths = [
          '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
        ];

        // Préparer les données pour le graphique pour l'année sélectionnée
        const labels = allMonths.map(month => getMonthName(month));
        const dataValues = allMonths.map(month => groupedByYearMonth[selectedYear]?.[month] || 0);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Revenues',
              data: dataValues,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false); // Terminer le chargement
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <LayoutAdmin>
      {loading ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, flexGrow: 1 }}
          noValidate
          autoComplete="off"
        >
          <h2>DASHBOARD</h2>
          <Container fluid>
            <Row>
              <Col sm={8}>
                <Row>
                  <Col sm={6}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          Total orders
                        </Typography>
                        <Typography variant="h5" component="div">
                          {formatter.format(nopurchase)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          Total revenue
                        </Typography>
                        <Typography variant="h5" component="div">
                          {formatter.format(sumvalue)} MGA
                        </Typography>
                      </CardContent>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <select value={selectedYear} onChange={handleYearChange}>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <Bar options={options} data={chartData} />
              </Col>
            </Row>
          </Container>
        </Box>
      )}
    </LayoutAdmin>
  );
}

export default Dashboard;