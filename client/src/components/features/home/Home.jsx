import { useEffect, useState } from 'react';

import styles from './Home.module.css';
import { useApi } from '../../core/hooks/useApi';
import { scrollToTop } from '../../utils/scrollToTop';
import { endpoint } from '../../core/environments/constants';

import Jokes from '../jokes/Jokes';
import CardMeme from '../meme/card-meme/CardMeme';
import Loading from '../../shared/loader/Loading';
import Message from '../../shared/messages/Message';
import NoContentMessage from '../../shared/no-content/NoContentMessage';
import ScrollToTopButton from '../../shared/scroll-to-top-button/ScrollToTopButton';

export default function Home() {
    const [topMemes, setTopMemes] = useState([]);                                                       // Use to save top three rated memes
    const [hasDeletedMeme, setHasDeletedMeme] = useState(false);                                        // Use when some meme is delete to rerender the component                                        
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();

    useEffect(() => {
        document.title = 'Home';                                                                        // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        setIsLoading(true);
        api.get(endpoint.getTopRatedMemes)
            .then(topThreeMemes => setTopMemes(topThreeMemes))
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));

    }, [hasDeletedMeme]);

    const handleDeleteMeme = () => {                                                                    // When there is a deleted meme re-render the component
        setHasDeletedMeme(!hasDeletedMeme);                                                             // This is where the component needs to be re-rendered because there should only be three top rated memes
    };

    return (
        <section className={`${styles['home']} max-width`}>
            <div className={styles['top-rated-memes']}>
                <h2><span>Top</span> <span>Three</span> <span>rated memes</span></h2>

                {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

                {isLoading && <Loading />}

                {
                    !serverMessage?.error && !isLoading
                        ? topMemes.length === 0
                            ? <NoContentMessage />
                            : topMemes.map(m => <CardMeme key={m._id} {...m} onDeleteMeme={handleDeleteMeme} />)
                        : null
                }

            </div>

            <Jokes />

            <ScrollToTopButton />

        </section >
    );
}