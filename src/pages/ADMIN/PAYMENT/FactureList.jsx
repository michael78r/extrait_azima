import React ,  { useState, useEffect}from 'react';
import LayoutAdmin from '../../LayoutAdmin';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { fetchInvoiceLists } from './ApiInvoice';
import { fetchPaymentLists } from './ApiPayment';
import { fetchShopPaymentLists } from './ApiShopPayment';
import { Box} from '@mui/material';
import InvoiceListTabs from './InvoiceListTabs';
import PaymentListTabs from './PaymentListTabs';
import UnpaidTabs from './UnpaidTabs';
import Badge from '@mui/material/Badge';

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
const FactureList = () =>{
    const [value, setValue] = React.useState(0);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [shops, setShop] = useState([]);
    const [totalCountOverdueInvoices, setTotalCountOverdueInvoices] = useState(0);
   
    const handleTotalCountOverdueInvoicesChange = (total) => {
        setTotalCountOverdueInvoices(total);
    };

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    useEffect(() => {
        Promise.all([fetchInvoiceLists(),fetchPaymentLists(),fetchShopPaymentLists()])
        .then(([invoiceData,paymentData,shopData])=> {
            setInvoices(invoiceData);
            setPayments(paymentData);
            setShop(shopData);
          })
          .catch(error => {
            console.log(error);
          });
    }, []);

    return (
      <LayoutAdmin>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="List of invoices" {...a11yProps(0)} />
            <Tab label="List of payments" {...a11yProps(1)} />
            <Tab label={
              <Badge badgeContent={totalCountOverdueInvoices} color="warning">
                List of unpaid invoices
              </Badge>
            }
            {...a11yProps(2)} />
          </Tabs>
        </Box>
        <InvoiceListTabs value={value} index={0} invoices={invoices}/>
        <PaymentListTabs value={value} index={1}  payments={payments}/>
        <UnpaidTabs value={value} index={2} shops={shops} onTotalCountOverdueInvoices={handleTotalCountOverdueInvoicesChange} />
      </LayoutAdmin>
    );
}

export default FactureList;