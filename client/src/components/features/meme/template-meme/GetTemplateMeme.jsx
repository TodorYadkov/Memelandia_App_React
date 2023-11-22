/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import styles from './GetTemplateMeme.module.css';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function GetTemplateMeme({ getTemplateHandler }) {
    const [memeTemplates, setMemeTemplates] = useState([]);                                             // All meme templates from the server https://imgflip.com/
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const apiGetURL = import.meta.env.VITE_IMGFLIP_URL_GET;
    useEffect(() => {
        setIsLoading(isLoading);
        fetch(apiGetURL)
            .then(response => response.json())
            .then(templateMemes => setMemeTemplates(templateMemes.data.memes))
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));

    }, []);

    return (
        <section className={styles['templates-meme']}>
            <div className={styles['templates-heading']}>
                <h3>Choose your template</h3>
            </div>

            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
            {isLoading && <Loading />}

            <div className={styles['templates-image-wrapper']}>

                {memeTemplates.length !== 0 && (
                    memeTemplates.map(t => (
                        <div key={t.id} onClick={() => getTemplateHandler(t)} className={styles['template-image']}>
                            <img src={t.url} alt={t.name} />
                            <p>{t.name}</p>
                        </div>
                    ))
                )}
            </div>
        </section >
    );
}