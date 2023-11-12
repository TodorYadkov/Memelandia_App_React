/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

import styles from './InfiniteScrollComponent.module.css';
import { paginationLimit } from '../../core/environments/constants';
import { useApi } from '../../core/hooks/useApi';

import CardMeme from '../../features/meme/card-meme/CardMeme';
import Loading from '../loader/Loading';
import Message from '../messages/Message';
import NoContentMessage from '../no-content/NoContentMessage';

export const InfiniteScrollComponent = ({ endpoint, setFetchedMemes }) => {
    const [memes, setMemes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });
    const [currentPage, setCurrentPage] = useState(1);                          // Current page
    const [totalPages, setTotalPages] = useState(1);                            // Total number of pages from the server

    const api = useApi();

    useEffect(() => {
        // Add a scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when this is the last page
        if (totalPages <= currentPage) {
            window.removeEventListener('scroll', handleScroll);
        }

        // Get memes from the server
        setIsLoading(true);
        api.get(`${endpoint}page=${currentPage}&limit=${paginationLimit}`)
            .then(serverData => {
                // Check for data, if not set an empty array and reset page count
                if (serverData.totalPages === 0) {
                    setMemes([]);
                    setCurrentPage(1);

                } else {
                    // If has data get only unique memes
                    setMemes((stateMemes) => {
                        const uniqueId = new Set(stateMemes.map((meme) => meme._id));                   // To make sure I only show unique memes, I keep the old ID state
                        const uniqueMemes = serverData.memes.filter((meme) => !uniqueId.has(meme._id)); // If the old ID is in the current server response, I don't add it to the current state
                        return [...stateMemes, ...uniqueMemes];                                         // Return only unique memes
                    });
                }
                // Get total number of pages from the server
                setTotalPages(serverData.totalPages);

                // This is utilized on the user's memes page to retrieve user details without making any additional server requests.
                ((setFetchedMemes && currentPage === 1) && (serverData.memes.length > 0)) && (
                    setFetchedMemes({ ...serverData.memes[0].author, userMemesCount: serverData.userMemesCount })
                );

            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [currentPage, totalPages, endpoint]);

    const handleScroll = async () => {
        // Define the threshold value before page end and where to trigger the next page
        const threshold = 250;

        // Check if the user has scrolled close to the bottom of the page
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
        if (window.innerHeight + document.documentElement.scrollTop + threshold >= document.documentElement.offsetHeight) {

            setCurrentPage(prevPage => prevPage + 1); // Add next page
        }
    };

    return (
        <>
            {isLoading && <Loading />}

            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {!serverMessage?.error && !isLoading
                ? memes.length !== 0
                    ? memes.map((meme) => <CardMeme key={meme._id} {...meme} />)
                    : endpoint.includes('search?') ? <h2 className={styles['not-found']}>No Found Results</h2> : <NoContentMessage />
                : null
            }
        </>
    );
};