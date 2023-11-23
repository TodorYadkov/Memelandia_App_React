import { host } from '../environments/constants';

async function api(method, clearUserSession, endpoint, accessToken, data) {
    const url = host + endpoint;                                                                        // Url to request server
    const options = {                                                                                   // Additional options for fetch
        method,
        headers: {},
    };
   
    if (data) {                                                                                         // Check for data
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    if (accessToken) {                                                                                   // Check for accessToken
        options.headers['X-Authorization'] = accessToken;
    }

    const response = await fetch(url, options);                                                         // Create a request to the server
    if (response.ok === false) {                                                                        // Check if the response is correct

        if (response.status === 401) {                                                                  // If the token is invalid, the server returns 401 (unauthorized) 
            clearUserSession();                                                                         // and to prevent a software lock, clear the token from localStorage
        }

        const error = await response.json();                                                            // The error that occurs must be caught in the component
        throw error;        
    }

    return response.json();                                                                             // Return data to the component
}

export const apiRequest = (clearUserSession, accessToken) => {                                          // Create factory function to bind needed argument to call api

    return {
        get: (endpoint) => api('GET', clearUserSession, endpoint, accessToken),
        post: (endpoint, data) => api('POST', clearUserSession, endpoint, accessToken, data),
        put: (endpoint, data) => api('PUT', clearUserSession, endpoint, accessToken, data),
        delete: (endpoint) => api('DELETE', clearUserSession, endpoint, accessToken)
    };
};