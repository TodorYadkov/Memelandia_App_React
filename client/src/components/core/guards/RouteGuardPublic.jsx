/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../hooks/useAuthContext';

export const RouteGuardPublic = ({ children }) => {
    const { isLoggedIn } = useAuthContext();

    if (isLoggedIn) {                                                                                   // If the user is logged in and wants to go where 
        return <Navigate to="/memes/catalog" replace />;                                                // they shouldn't be logged in, redirect to /memes/catalog (login, register)
    }

    return children ? children : <Outlet />;
}; 