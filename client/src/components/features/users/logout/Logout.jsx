import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../../core/hooks/useApi';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { endpoint } from '../../../core/environments/constants';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function Logout() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { clearUserSession } = useAuthContext();
    const navigate = useNavigate();
    const api = useApi();

    useEffect(() => {
        api.get(endpoint.logout)
            .then(data => clearUserSession())
            .catch(error => {
                setErrorMessage(error.message);
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
            {errorMessage && <Message type="error" message={errorMessage} />}
        </>
    );
}