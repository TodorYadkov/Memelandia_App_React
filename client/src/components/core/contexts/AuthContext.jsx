/* eslint-disable react/prop-types */
import { createContext } from 'react';

import { useSessionStorage } from '../hooks/useSessionStorage';
                               
export const AuthContext = createContext(null);                                                         // Create AuthContext

export const AuthProvider = ({ children }) => {                                                         // Crate auth provider (to use in app only use AuthProvider around the routes)
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