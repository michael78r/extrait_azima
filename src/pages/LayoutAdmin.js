import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import companyLogo from '../../public/img/logo.png';
import profileImage from '../../public/img/profile-img.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import MyContext from './MyContext';
import axios from 'axios';

const LayoutAdmin =({children}) =>{
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [depart, setDepart] = useState("true");
    const {username1} = useContext(MyContext);
    const [maFonction, setMafonction] = useState('');

    const handleClick = () => {
        setDepart(!depart);
    }
    const navigate = useNavigate();
    
    const handleSignOut = () => {
        localStorage.removeItem('token');
        
        // Redirect the user to the login page
        navigate('/login');

        window.location.reload();
    };

    const handleDetails = () => {
        navigate(`/detailuser`);
    };

    useEffect(() => {
        axios.get(`/api/user/${username1}`)
        .then(function (response) {
          const infouser = response.data;
          setMafonction(infouser.Fonction);
          console.log('fonction = '+maFonction);
        })
        .catch(function (error) {
          console.log(error);
        })
    }, [])

    return(
        <div className={depart && "toggle-sidebar"}>
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <a href="/" className="logo d-flex align-items-center">
                    {/* <img src={companyLogo} alt="" /> */}
                        <span className="d-none d-lg-block">AZIMA</span>
                </a>
                <i className="bi bi-list toggle-sidebar-btn" onClick={handleClick}></i>
            </div>

            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-lg-none">
                        <a className="nav-link nav-icon search-bar-toggle " href="#">
                            <i className="bi bi-search"></i>
                        </a>
                    </li>
                    <li className="nav-item dropdown pe-3">
                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown"> 
                            <span className="d-none d-md-block dropdown-toggle ps-2">{username1}</span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{username1}</h6>
                                <span>{maFonction}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                            <a className="dropdown-item d-flex align-items-center" href="#" onClick={handleDetails}>
                                <i className="bi bi-gear"></i>
                                <span>Details</span>
                            </a>
                            </li>
                            <li>
                            <a className="dropdown-item d-flex align-items-center" href="#" onClick={handleSignOut}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Sign Out</span>
                            </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>

        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                {/* <li className="nav-item">
                    <a className="nav-link collapsed" href="/">
                        <i className="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </a>
                </li> */}
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#sales-nav" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-person-fill"></i><span>Salesperson</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="sales-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <a href="/sales">
                        <i className="bi bi-circle"></i><span>List of salesperson</span>
                        </a>
                    </li>

                  
                    {/* <li>
                        <a href="/addsales">
                        <i className="bi bi-circle"></i><span>Add a new salesperson</span>
                        </a>
                    </li> */}
                    </ul>
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#ordering-nav" data-bs-toggle="collapse" href="#">
                        <i className="bi bi-box-seam"></i><span>Ordering</span><i className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="ordering-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/purchase">
                                <i className="bi bi-circle"></i><span>List of orders</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#goods-nav" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-box-seam"></i><span>Products</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="goods-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <a href="/goods">
                        <i className="bi bi-circle"></i><span>List of products</span>
                        </a>
                    </li>
                    <li>
                        <a href="/addgood">
                        <i className="bi bi-circle"></i><span>Add a new product</span>
                        </a>
                    </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#shops-nav" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-house"></i><span>Shops</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="shops-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <a href="/shops">
                        <i className="bi bi-circle"></i><span>List of shops</span>
                        </a>
                    </li>
                    <li>
                        <a href="/addshop">
                        <i className="bi bi-circle"></i><span>Add a new shop</span>
                        </a>
                    </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#city-nav" data-bs-toggle="collapse" href="#">
                        <i className="bi bi-globe-europe-africa"></i><span>City</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="city-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                        <li>
                            <a href="/city">
                                <i className="bi bi-circle"></i><span>List of city</span>
                            </a>
                        </li>
                        <li>
                            <a href="/addcity">
                                <i className="bi bi-circle"></i><span>Add a new city</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed"  href="/invoices">
                        <i className="bi bi-receipt"></i><span>Invoices</span>
                    </a>
                </li>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#report-nav" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-grid"></i><span>Report</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="report-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <a href="/brandwise">
                        <i className="bi bi-circle"></i><span>Brandwise</span>
                        </a>
                    </li>
                    <li>
                        <a href="/shopwise">
                        <i className="bi bi-circle"></i><span>Shopwise</span>
                        </a>
                    </li>
                    <li>
                        <a href="/">
                        <i className="bi bi-circle"></i><span>Grouped Brandwise</span>
                        </a>
                    </li>
                    <li>
                        <a href="/groupedshopwise">
                        <i className="bi bi-circle"></i><span>Grouped Shopwise</span>
                        </a>
                    </li>
                    </ul>
                </li>
                
               
               
               
                
              
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#inventory-nav" data-bs-toggle="collapse" href="#">
                        <i className="bi bi-box-seam"></i><span>Promotion</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="inventory-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                        <li>
                            <a href="/promotions">
                                <i className="bi bi-circle"></i><span>List of promotions</span>
                            </a>
                        </li>
                        <li>
                            <a href="/addpromotion"> 
                                <i className="bi bi-circle"></i><span>Add promotion</span>
                            </a>
                        </li>
                        
                        
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#user-nav" data-bs-toggle="collapse" href="#">
                        <i className="bi bi-people-fill"></i><span>User</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="user-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                        {/* <li>
                            <a href="/inventories">
                                <i className="bi bi-circle"></i><span>List of users</span>
                            </a>
                        </li> */}
                        <li>
                            <a href="/addusersalesman">
                                <i className="bi bi-circle"></i><span>Add user</span>
                            </a>
                        </li>
                        <li>
                            <a href="/listuser">
                                <i className="bi bi-circle"></i><span>List of users</span>
                            </a>
                        </li>
                        
                    </ul>
                </li>
                {/* <li className="nav-item">
                    <a className="nav-link " href="#">
                        <i className="bi bi-grid"></i>
                        <span>Shop</span>
                    </a>
                </li> */}
                {/* <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-target="#tresorerie-nav" data-bs-toggle="collapse" href="#">
                    <i className="bi bi-layout-text-window-reverse"></i><span>Client</span><i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="tresorerie-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                    <li>
                        <a href="/grandecaisse">
                        <i className="bi bi-circle"></i><span>Liste des clients</span>
                        </a>
                    </li>
                    <li>
                        <a href="tables-data.html">
                        <i className="bi bi-circle"></i><span>Créér un nouveau client</span>
                        </a>
                    </li>
                    </ul>
                </li> */}
                {/* <li className="nav-heading">SUIVI</li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="users-profile.html">
                    <i className="bi bi-person"></i>
                    <span>City</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="pages-faq.html">
                    <i className="bi bi-question-circle"></i>
                    <span>Salesmen</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="pages-faq.html">
                    <i className="bi bi-question-circle"></i>
                    <span>Brands</span>
                    </a>
                </li> */}
            </ul>
        </aside>

        <main id="main" className="main">

        <section className="section dashboard">
            <div className="row">
                {children}
            </div>
        </section>

        

        </main>

        </div>
    )
}
    
export default LayoutAdmin;