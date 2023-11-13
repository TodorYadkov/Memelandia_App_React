/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../hooks/useAuthContext';

export const RoutGuardAuthenticated = ({ children }) => {
    const { isLoggedIn } = useAuthContext();

    if (!isLoggedIn) {                                                                                  // If the user is not logged in and wants to go to 
        return <Navigate to="/login" replace />;                                                        // the place where they should be logged in, redirect to login
    }

    return children ? children : <Outlet />;
};