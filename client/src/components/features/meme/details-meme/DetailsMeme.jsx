import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './DetailsMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';
import { scrollToTop } from '../../../utils/scrollToTop';

import CardMeme from '../card-meme/CardMeme';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import ListComments from '../../comment/list-comments/ListComments';

export default function DetailsMeme() {
    const [currentMeme, setCurrentMeme] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' }); // Use to display various messages from the server

    const api = useApi();
    const { memeId } = useParams('memeId');                             // Get memeId from query params

    useEffect(() => {
        // Add page title
        document.title = 'Details';

        // Scroll to the top of the page
        scrollToTop();

        setIsLoading(true);
        api.get(endpoint.getMemeById(memeId))
            .then(memeDetails => setCurrentMeme(memeDetails))
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className={`${styles['details']} max-width`}>

            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {isLoading
                ? <Loading />
                : <>
                    <div className={styles['details-card']}>
                        {currentMeme?._id && <CardMeme {...currentMeme} />}

                    </div>
                    <div className={styles['details-comments']}>
                        {currentMeme?._id && <ListComments memeInfo={currentMeme} />}

                    </div>
                </>
            }

        </section>
    );
}