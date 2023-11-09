import { useState } from 'react';

import { tokenName } from '../environments/constants';

export const useSessionStorage = () => {
    // User data is saved in context to easy use in app: { _id, username, email, name, age, rating, createdUser, updatedUser }
    const [currentUserData, setCurrentUserData] = useState({});

    // Initial user token is saved in local storage --> can be null or accessToken
    const [currentUserToken, setCurrentUserToken] = useState(() => {
        try {
            // Verify that the data in the local storage is in the correct format
            const localStorageData = JSON.parse(localStorage.getItem(tokenName));
            if (localStorageData) {
                return localStorageData;
            }

        } catch (error) {
            console.error(error);
            return null;
        }
        // Default value
        return null;
    });

    // Set new user state
    const setUserState = (userData) => {
        // If has a userData set new user state and user data
        if (userData) {
            localStorage.setItem(tokenName, JSON.stringify(userData.accessToken));
            setCurrentUserToken(userData.accessToken); // The token is used to make a request to the server
            setCurrentUserData(userData.userDetails);  // User data is used to get needed properties in entire app using a context
        }
    };

    // Clear current user state
    const clearUserState = () => {
        localStorage.removeItem(tokenName);
        setCurrentUserToken(null); // Set new state to null
        setCurrentUserData({});    // Set new state to empty object
    };

    return {
        setUserState,
        clearUserState,
        currentUserToken,
        currentUserData,
    };
};