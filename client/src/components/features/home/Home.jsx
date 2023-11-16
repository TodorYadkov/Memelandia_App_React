import { useEffect, useState } from 'react';

import styles from './Home.module.css';
import { useApi } from '../../core/hooks/useApi';
import { endpoint } from '../../core/environments/constants';
import { scrollToTop } from '../../utils/scrollToTop';

import CardMeme from '../meme/card-meme/CardMeme';
import Jokes from '../jokes/Jokes';
import Loading from '../../shared/loader/Loading';
import Message from '../../shared/messages/Message';
import NoContentMessage from '../../shared/no-content/NoContentMessage';
import ScrollToTopButton from '../../shared/scroll-to-top-button/ScrollToTopButton';

export default function Home() {
    const [topMemes, setTopMemes] = useState([]);
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
    }, []);

    return (
        <section className={`${styles['home']} max-width`}>
            <div className={styles['welcome']}>
                <h1 className={styles['welcome-text']}>Welcome to <span>Meme</span><span>Landia</span></h1>
                <div className={styles['welcome-img-wrapper']}>
                    <img className={styles['welcome-image-default']} src="/assets/pepe-the-frog.png" alt="Pepe the Frog meme" />
                    <img className={styles['welcome-image-on-hover']} src="/assets/pepe-the-frog-time.png" alt="Pepe the Frog meme" />
                </div>
            </div>
            <div className={styles['top-rated-memes']}>
                <h2>
                    <span className={styles['span']}>Top</span>
                    <span className={styles['span']}>three</span>
                    <span className={styles['span']}>rated</span>
                    <span className={styles['span']}>memes</span>
                </h2>
                {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

                {isLoading && <Loading />}

                {
                    !serverMessage?.error && !isLoading
                        ? topMemes.length === 0
                            ? <NoContentMessage />
                            : topMemes.map(m => <CardMeme key={m._id} {...m} />)
                        : null
                }

            </div>

            <Jokes />
            
            <ScrollToTopButton />

        </section >
    );
}