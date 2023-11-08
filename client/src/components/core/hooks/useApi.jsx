import { useAuthContext } from './useAuthContext';
import { apiRequest } from '../services/api/api';

// Create custom hook to make authenticated request
export const useApi = () => {
    // Use from AuthContext this method to clear localStorage and to get user token in api
    const { clearUserSession, getUserToken } = useAuthContext();
    // Invoke apiRequest with needed arguments and save all methods for making a request to the server
    const api = apiRequest(clearUserSession, getUserToken);

    return api;
};