/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from '../hooks/useAuthContext';

export const RouteGuardPublic = ({ children }) => {
    const { isLoggedIn } = useAuthContext();

    if (isLoggedIn) {
        return <Navigate to="/memes/catalog" replace />;
    }

    return children ? children : <Outlet />;
}; 