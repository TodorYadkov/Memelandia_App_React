import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function Logout() {
    const [isLoading, setIsLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();
    const navigate = useNavigate();
    const { clearUserSession } = useAuthContext();

    useEffect(() => {
        document.title = 'Logout page';                                                                 // Add page title

        api.get(endpoint.logout)
            .then(data => clearUserSession())
            .catch(error => {
                setServerMessage({ error: error.message });
                clearUserSession();
            })
            .finally(() => {
                setIsLoading(false);
                navigate('/', { replace: true });
            });
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
        </>
    );
}