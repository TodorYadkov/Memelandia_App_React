/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './InfiniteScrollComponent.module.css';
import { paginationLimit } from '../../core/environments/constants';
import { useApi } from '../../core/hooks/useApi';

import CardMeme from '../../features/meme/card-meme/CardMeme';
import Loading from '../loader/Loading';
import Message from '../messages/Message';
import NoContentMessage from '../no-content/NoContentMessage';

export const InfiniteScrollComponent = ({ endpoint, setUserDetailsFromFetchedMeme }) => {
    const [memes, setMemes] = useState([]);                                                             // State of all memes to render
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });
    const [currentPage, setCurrentPage] = useState(1);                                                  // Current page to fetch data from the server
    const [totalPages, setTotalPages] = useState(1);                                                    // Total number of pages from the server

    const [searchParams] = useSearchParams();                                                           // Use to handle query params

    const api = useApi();

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);                                                // Add a scroll event listener

        if (totalPages <= currentPage) {                                                                // Cleanup the event listener when this is the last page
            window.removeEventListener('scroll', handleScroll);
        }

        setIsLoading(true);
        api.get(`${endpoint}page=${currentPage}&limit=${paginationLimit}`)                              // Get memes from the server
            .then(serverData => {
                if (serverData.totalPages === 0) {                                                      // Check for data, if not set an empty array and reset page count
                    setMemes([]);
                    setCurrentPage(1);

                } else {                                                                                // If has data get only unique memes
                    setMemes((stateMemes) => {
                        const uniqueId = new Set(stateMemes.map((meme) => meme._id));                   // To make sure I only show unique memes, I keep the old ID state
                        const uniqueMemes = serverData.memes.filter((meme) => !uniqueId.has(meme._id)); // If the old ID is in the current server response, I don't add it to the current state
                        return [...stateMemes, ...uniqueMemes];                                         // Return only unique memes
                    });
                }

                setTotalPages(serverData.totalPages);                                                   // Get total number of pages from the server

                ((setUserDetailsFromFetchedMeme && currentPage === 1) && (serverData.memes.length > 0)) // This is utilized on the user's memes page to retrieve user details without making any additional server requests.
                    && (setUserDetailsFromFetchedMeme(
                        { ...serverData.memes[0].author, userMemesCount: serverData.userMemesCount }
                    ));
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));

        return () => {                                                                                  // Cleanup the event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };

    }, [currentPage, totalPages, endpoint]);


    useEffect(() => {                                                                                   // Use to set a new empty state to memes when the search params change
        if (searchParams) {                                                                             // Reset state and re-fetch when the search parameters change
            setMemes([]);
            setCurrentPage(1);
        }
    }, [searchParams]);

    const handleScroll = async () => {

        const threshold = 250;                                                                          // Define the threshold value before page end and where to trigger the next page

        // Check if the user has scrolled close to the bottom of the page
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
        if (window.innerHeight
            + document.documentElement.scrollTop
            + threshold
            >= document.documentElement.offsetHeight) {

            setCurrentPage(prevPage => prevPage + 1);                                                   // Add next page
        }
    };

    const handleDeleteMeme = (deletedMemeId) => {                                                       // Delete meme from a locale state
        setMemes(allMemes => (                                                                          // From CardMeme component, return the Id of the deleted meme
            [...allMemes.filter(c => c._id !== deletedMemeId)]                                          // Get all memes without deleted meme id
        ));
    };

    return (
        <>
            {isLoading && <Loading />}

            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {!serverMessage?.error && !isLoading
                ? memes.length !== 0
                    ? memes.map((meme) => <CardMeme key={meme._id} {...meme} onDeleteMeme={handleDeleteMeme} />)
                    : endpoint.includes('search?') ? <h2 className={styles['not-found']}>No Found Results</h2> : <NoContentMessage />
                : null
            }
        </>
    );
};