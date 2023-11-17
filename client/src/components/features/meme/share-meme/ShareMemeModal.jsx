/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

import styles from './ShareMemeModal.module.css';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function ShareMemeModal({ modalHandler, imageUrl }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                     // Use to display various messages from the server
    const [newShortUrl, setNewShortUrl] = useState(imageUrl);                                           // Use to give a new short URL to the user, default is main imageUrl
    const inputRef = useRef(null);

    const apiShortenUrl = import.meta.env.VITE_SHORTEN_URL;                                             // Get shorten URL from environment

    useEffect(() => {                                                                                   // Use an external URL shortener API - https://is.gd/apishorteningreference.php
        const currentUrl = apiShortenUrl + imageUrl;                                                    // Add a URL to be shortened
        // setIsLoading(true);  // TODO: uncomment this when all the other things are ready to not make many request to external api
        // fetch(currentUrl)                                                                               // Send request with original URL
        //     .then(response => response.json())                                                          // Returned data is in JSON format
        //     .then(data => {                                                                             // Get data from the API
        //         data['errormessage']                                                                    
        //             ? setServerMessage({ error: data.errormessage })                                    // The API returns an error message in the response and I capture it here                                    
        //             : setNewShortUrl(data.shorturl);                                                    // Get short URL
        //     })                                             
        //     .catch(error => setServerMessage({ error: error.message }))                                 // Set error if there is another error
        //     .finally(() => setIsLoading(false));

        const input = inputRef.current;                                                                 // Get ref to the input with link                                                                              
        input.select();                                                                                 // Select all the content inside the input

    }, []);

    const copyFromClipboard = () => {
        navigator.clipboard.writeText(newShortUrl)                                                      // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
            .then(() => setServerMessage({ success: 'URL copied 😊' }))
            .catch(error => setServerMessage({ error: error.errormessage }));
    };

    return (
        <div className="comment-modal">
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-regular fa-share-from-square"></i> Share with friends</h4>
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                    </div>
                    <div className={`modal-content ${styles['modal-content']}`}>
                        <div className={styles['modal-content-message']}>
                            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                            {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}
                        </div>

                        {isLoading
                            ? <Loading />
                            :
                            <div className={styles['modal-content-actions']}>
                                <input ref={inputRef} className={styles['input']} type="text" defaultValue={newShortUrl} readOnly />
                                <button onClick={copyFromClipboard} className={`${styles['btn']} ${styles['btn-copy']}`}><i className="fa-regular fa-copy"></i> Copy</button>
                            </div>
                        }

                    </div>
                    <div className="modal-footer">
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}