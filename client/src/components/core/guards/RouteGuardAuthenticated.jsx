/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../hooks/useAuthContext';

export const RoutGuardAuthenticated = ({ children }) => {
    const { isLoggedIn } = useAuthContext();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};