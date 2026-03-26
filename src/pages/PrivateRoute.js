import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = (props) => {
    const userRoles = props?.monRole;
    const allowedRoles = props?.roleAutorise;
    const allowedRole = userRoles.find(role => allowedRoles?.includes(role));
    const location = useLocation();
    return(
        allowedRole ? <Outlet/> : <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
}

export default PrivateRoutes;