import { useState } from 'react';

import { tokenName } from '../environments/constants';

export const useSessionStorage = () => {
    const [currentUserData, setCurrentUserData] = useState({});                                         // User data is saved in context to easy use in app:

    const [currentUserToken, setCurrentUserToken] = useState(() => {                                    // Check if initial user token is saved in local storage --> can be null or accessToken
        try {
            const localStorageData = JSON.parse(localStorage.getItem(tokenName));                       // Verify that the data in the local storage is with teh correct name
            if (localStorageData) {
                return localStorageData;
            }

        } catch (error) {
            console.error(error);                                                                       // If has error only show error in console and set initial state to null
            return null;
        }
        
        return null;                                                                                    // Default value
    });

    const setUserState = (userData) => {                                                                // Set new user state
        
        if (userData) {                                                                                 // If has a userData set new user state and user data
            localStorage.setItem(tokenName, JSON.stringify(userData.accessToken));                      // Save in local storage only access token (JWT)
            setCurrentUserToken(userData.accessToken);                                                  // The token is used to make a request to the server
            setCurrentUserData(userData.userDetails);                                                   // User data is used to obtain required properties throughout the application using a context
        }
    };

    const clearUserState = () => {                                                                      // Clear current user state
        localStorage.removeItem(tokenName);                                                             // Remove only token from local storage
        setCurrentUserToken(null);                                                                      // Set new state to null
        setCurrentUserData({});                                                                         // Set new state to empty object
    };

    return {
        setUserState,
        clearUserState,
        currentUserToken,
        currentUserData,
    };
};