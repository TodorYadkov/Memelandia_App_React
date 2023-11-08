import { createContext } from 'react';

import { useSessionStorage } from '../hooks/useSessionStorage';

// Create AuthContext
export const AuthContext = createContext(null);
// Crate auth provider to use in app only use AuthProvider around the routes
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const sessionManager = useSessionStorage();

    const contextValues = {
        addUserSession: (userData) => sessionManager.setUserState(userData),
        clearUserSession: () => sessionManager.clearUserState(),
        getUserToken: sessionManager.currentUserToken,
        getUserDetails: sessionManager.currentUserData,
        isLoggedIn: !!sessionManager.currentUserToken,
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    );
};