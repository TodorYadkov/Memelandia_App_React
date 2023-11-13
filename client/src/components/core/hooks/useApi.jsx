import { useAuthContext } from './useAuthContext';
import { apiRequest } from '../services/api/api';

export const useApi = () => {                                                                           // Create custom hook to make authenticated request
    const { clearUserSession, getUserToken } = useAuthContext();                                        // Use from AuthContext this method to clear localStorage and to get user token in api
    const api = apiRequest(clearUserSession, getUserToken);                                             // Invoke apiRequest with needed arguments for making a request to the server
    
    return api;
};