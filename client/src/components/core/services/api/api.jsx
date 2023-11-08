import { host } from '../../environments/constants';

async function api(method, clearUserSession, endpoint, accessToken, data) {
    const url = host + endpoint;
    // Additional options for fetch
    const options = {
        method,
        headers: {},
    };
   
    // Check for data
    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    // Check for accessToken
    if (accessToken) {
        options.headers['X-Authorization'] = accessToken;
    }

    // Create a request to the server
    const response = await fetch(url, options);
    // Check if the response is correct
    if (response.ok === false) {
        // If the token is invalid, the server returns 401 (unauthorized) and to prevent a software lock, clear the token from localStorage
        if (response.status === 401) {
            clearUserSession();
        }

        // The error that occurs must be caught in the component
        const error = await response.json();
        throw error;
    }

    return response.json();
}

// Create factory function to bind needed argument to call api
export const apiRequest = (clearUserSession, accessToken) => {

    return {
        get: (endpoint) => api('GET', clearUserSession, endpoint, accessToken),
        post: (endpoint, data) => api('POST', clearUserSession, endpoint, accessToken, data),
        put: (endpoint, data) => api('PUT', clearUserSession, endpoint, accessToken, data),
        delete: (endpoint) => api('DELETE', clearUserSession, endpoint, accessToken)
    };
};