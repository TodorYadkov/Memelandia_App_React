import { useEffect, useState } from 'react';

import styles from './Jokes.module.css';

import Loading from '../../shared/loader/Loading';
import Message from '../../shared/messages/Message';

export default function Jokes() {
    const [jokeObj, setJokeObj] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    useEffect(() => {
        // getJoke(); // TODO: uncomment this when all the other things are ready to not make many request to external api
    }, []);
    
    const jokeUrl = import.meta.env.VITE_JOKE_URL;                                                      // Get the url to the api from the environment     
    const getJoke = () => {                                                                             // Get joke function
        setIsLoading(true);
        fetch(jokeUrl)                                                                                  // This api returns an error as a response, 
            .then(response => response.json())                                                          // and the way to get the error message is in the response, not in the catch block
            .then(dataJoke => {
                if (dataJoke?.error) {
                    setServerMessage({ error: dataJoke.message });
                } else {
                    setJokeObj(dataJoke);
                }
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    const clickHandler = () => {
        getJoke();
    };

    return (
        <>
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
            <div className={styles['jokes']}>
                <div className={styles['jokes-wrapper-heading']}>
                    <h3>Something Funny</h3>
                    <img src="/assets/emoji-smile.svg" alt="Emoji smile" />
                </div>
                <div className={styles['jokes-wrapper-text']}>

                    <p className={styles['jokes-text']}><sup><i className="fa-solid fa-quote-left"></i></sup>{jokeObj?.joke}</p>

                </div>
                <div className={styles['jokes-wrapper-footer']}>
                    <p className={styles['footer-text']}>&quot;Smile: Making the world a better place to live <span>😊</span>&quot;</p>

                    {
                        isLoading
                            ? <div className={styles['jokes-loader']}><Loading width={'35px'} height={'35px'} /></div>
                            : <button onClick={clickHandler} className={`btn ${styles['more']}`}><i className="fa-solid fa-angles-right"></i></button>
                    }
                </div>
            </div>
        </>
    );
}