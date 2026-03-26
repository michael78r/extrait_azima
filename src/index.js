import React, { useState, useEffect } from 'react';
import {StrictMode } from "react";
import {createRoot } from "react-dom/client";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import Categories from './pages/ADMIN/PARAMETRE/CATEGORIE/Categories';
// import Parametres from './pages/ADMIN/PARAMETRE/Parametres';
// import Login from './pages/Authentication/login';
// import Unauthorized from './pages/Autres/Unauthorized';
// import Page404 from './pages/Autres/Page404';
// import Essai from './pages/Authentication/essai';
// import useToken from './pages/useToken';
// import { jwtDecode } from "jwt-decode";
// import MyContext from './pages/MyContext';
// import PrivateRoutes from './pages/PrivateRoute';
// import CategorieModif from './pages/ADMIN/PARAMETRE/CATEGORIE/CategorieModif';
// import UniteModif from './pages/ADMIN/PARAMETRE/UNITE/UniteModif';
// import LocalisationModif from './pages/ADMIN/PARAMETRE/LOCALISATION/LocalisationModif';
// import City from './pages/ADMIN/CITY/City';
// import UpdateCity from './pages/ADMIN/CITY/UpdateCity';
// import AddCity from './pages/ADMIN/CITY/AddCity';
// import Sales from './pages/ADMIN/SALESMEN/Sales';
// import AddSales from './pages/ADMIN/SALESMEN/AddSales';
// import UpdateSales from './pages/ADMIN/SALESMEN/UpdateSales';
// import Goods from './pages/ADMIN/GOODS/Goods';
// import AddGood from './pages/ADMIN/GOODS/AddGood';
// import UpdateGood from './pages/ADMIN/GOODS/UpdateGood';
// import Shops from './pages/ADMIN/SHOP/Shops';
// import AddShop from './pages/ADMIN/SHOP/AddShop';
// import UpdateShop from './pages/ADMIN/SHOP/UpdateShop';
// import Shopsales from './pages/ADMIN/SHOP/Shopsales';
// import Purchase from './pages/ADMIN/PURCHASE/Purchase';
// import AddaPurchase from './pages/ADMIN/PURCHASE/AddaPurchase';
// import CreateInvoice from './pages/ADMIN/PURCHASE/CreateInvoice';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import EditPurchase from './pages/ADMIN/PURCHASE/EditPurchase';
// import ExporterBon from './pages/ADMIN/PURCHASE/ExporterBon';
// import ExporterCashVan from './pages/ADMIN/PURCHASE/ExporterCashVan';
// import Brandwise from './pages/ADMIN/REPORT/Brandwise';
// import Shopwise from './pages/ADMIN/REPORT/Shopwise';
import GroupedBrandwise from './pages/ADMIN/REPORT/GroupedBrandwise';
// import GroupedShopwise from './pages/ADMIN/REPORT/GroupedShopwise';
// import PaidShop from './pages/ADMIN/SHOP/PaidShop';
// import AddUser from './pages/ADMIN/USERS/AddUser';
// import AddUserSalesMan from './pages/ADMIN/USERS/AddUserSalesMan';
// import Payment from './pages/ADMIN/SHOP/Payment';
// import Registration from './pages/Authentication/registration';
// import PaymentTabs from './pages/ADMIN/PAYMENT/PaymentTabs';

// import FactureList from './pages/ADMIN/PAYMENT/FactureList';
// import DetailUser from './pages/ADMIN/USERS/DetailUser';

// import ItemList from './pages/ADMIN/INVENTORY/ItemList';
// import AddItem from './pages/ADMIN/INVENTORY/AddItem';
// import ListUser from './pages/ADMIN/USERS/ListUser';
// import UpdateUser from './pages/ADMIN/USERS/UpdateUser';
// import MoveItem from './pages/ADMIN/INVENTORY/MoveItem';
// import TodayReport from './pages/ADMIN/REPORT/TodayReport';
// import AddaPurchaseByInvoice from './pages/ADMIN/PURCHASE/AddaPurchaseByInvoice';

// import AddPromotion from './pages/ADMIN/PROMOTION/AddPromotion';
// import Promotion from './pages/ADMIN/PROMOTION/Promotions';
// import AllGroupedShopwise from './pages/ADMIN/REPORT/AllGroupedShopwise';

function Main() {
    // const { token, setToken } = useToken();
    // if (!token) {
    //     console.log('deconnecté');
    //     return <Login setToken={setToken} />
    // }
    // else {
        // const decoded = jwtDecode(token);
        // const [username1, setUsername1] = useState(decoded.username);
        // const roles1 = decoded.roles;
        // console.log(roles1);
        // if(roles1[0]!="ADMIN"){
        //     return <Login setToken={setToken} message="Unauthorized user" />
        // }

    return (
        // <MyContext.Provider value={{username1,setUsername1}}>
        <Router>
            <Routes>
                {/* <Route element={<PrivateRoutes monRole="ADMIN" roleAutorise={["ADMIN"]} />}> */}
                    {/* <Route exact path="/" element={<Dashboard/>} /> */}
                    <Route exact path="/test" element={<GroupedBrandwise/>} />
                    {/* <Route exact path="/groupedshopwise" element={<GroupedShopwise/>} />
                    <Route exact path="/allgroupedshopwise" element={<AllGroupedShopwise/>} />
                    <Route exact path="/shopwise" element={<Shopwise/>} />
                    <Route exact path="brandwise" element={<Brandwise/>} />
                    <Route exact path="/todayreport" element={<TodayReport/>} /> */}
                    {/* CITY */}
                    {/* <Route exact path="/city" element={<City/>} />
                    <Route exact path="/addcity" element={<AddCity/>} />
                    <Route exact path="/city/:id" element={<UpdateCity/>} /> */}
                    {/* SALES */}
                    {/* <Route exact path="/sales" element={<Sales/>} />
                    <Route exact path="/addsales" element={<AddSales/>} />
                    <Route exact path="/sales/:id" element={<UpdateSales/>} /> */}
                    {/* GOODS */}
                    {/* <Route exact path="/goods" element={<Goods/>} />
                    <Route exact path="/addgood" element={<AddGood/>} />
                    <Route exact path="/good/:id" element={<UpdateGood/>} /> */}
                    {/* USER */}
                    {/* <Route exact path="/adduser" element={<AddUser/>} />
                    <Route exact path="/user/:username" element={<UpdateUser/>} />
                    <Route exact path="/listuser" element={<ListUser/>} />
                    <Route exact path="/addusersalesman" element={<AddUserSalesMan/>} />
                    <Route exact path="/parametre" element={<Parametres/>} />
                    <Route exact path="/localisation/:id" element={<LocalisationModif/>} />
                    <Route exact path="/categorie/:id" element={<CategorieModif/>} />
                    <Route exact path="/unite/:id" element={<UniteModif/>} />
                    <Route exact path="/register" element={<Registration/>} /> */}

                    {/* INVOICES */}
                    {/* <Route exact path="/invoices" element={<FactureList/>} /> */}
                    {/* <Route exact path="/essai" element={<PaymentTabs/>} /> */}

                {/* </Route> */}
                {/* <Route element={<PrivateRoutes monRole={roles1} roleAutorise={["ADMIN", "SALES"]} />}> */}
                    {/* SHOPS */}
                    {/* <Route exact path="/shops" element={<Shops/>} />
                    <Route exact path="/addshop" element={<AddShop/>} />
                    <Route exact path="/shop/:id" element={<UpdateShop/>} />
                    <Route exact path="/shopsales/:id" element={<Shopsales/>} />
                    <Route exact path="/paidshop/:id" element={<PaidShop/>} />
                    <Route exact path="/payment" element={<Payment/>} /> */}
                    {/* PURCHASE */}
                    {/* <Route exact path="/purchase" element={<Purchase/>} />
                    <Route exact path="/addapurchase/:shopId/:salesId" element={<AddaPurchase/>} />
                    <Route exact path="/addapurchase/:shopId/:salesId/:invoiceId" element={<AddaPurchaseByInvoice/>} />
                    <Route exact path="/editpurchase/:id/" element={<EditPurchase/>} />
                    <Route path="/invoice" element={<CreateInvoice />} />
                    <Route path="/facture" element={<ExporterBon />} />
                    <Route path="/cashvan" element={<ExporterCashVan />} /> */}
                    {/* USER */}
                    {/* <Route exact path="/login"  element={<Navigate to="/purchase" replace />} />
                    <Route exact path="/detailuser"  element={<DetailUser/>} /> */}
                    
                    {/* <Route exact path="*" element={<Page404 />} /> */}

                    {/* INVENTORY */}
                    {/* <Route exact path="/inventories" element={<ItemList/>} />
                    <Route exact path="/additem" element={<AddItem/>} />
                    <Route exact path="/moveitem" element={<MoveItem/>} /> */}

                    {/* PROMOTION */}
                    {/* <Route exact path="/promotions" element={<Promotion/>} />
                    <Route exact path="/addpromotion" element={<AddPromotion/>} /> */}

                {/* </Route> */}
            </Routes>
        </Router>
        // </MyContext.Provider>
    );
}
// }
export default Main;  

if (document.getElementById('app')) {
    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <Main />
        </StrictMode>
    );
}