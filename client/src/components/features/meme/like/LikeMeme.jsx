/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import styles from './LikeMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function LikeMeme({ memeId, likeDislikeState, setLikeDislikeState }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const api = useApi();

    useEffect(() => {
        setLikeDislikeState(state => ({ ...state, likeHandler }));                                      // Add like handler to state to be used in DislikeMeme

    }, []);

    const likeHandler = () => {
        const isLiked = likeDislikeState.isUserAlreadyLiked;                                            // Get the user's current likes status
        const isDisliked = likeDislikeState.isUserAlreadyDisliked;                                      // Get the user's current dislikes status
        const btnAreClicked = isLiked && isDisliked;                                                    // Get the current state of the like and dislike buttons 
        const btnAreNotClicked = !isLiked && !isDisliked;
        const newIsLiked = isLiked && !isDisliked;                                                      // Handle the scenario where clicking on Like removes Dislike

        if ((btnAreNotClicked || newIsLiked) || btnAreClicked) {
            setIsLoading(true);
            api.get(endpoint.addRemoveLikeMeme(memeId))
                .then(serverData => {
                    setLikeDislikeState(state => {
                        state.likeArr = [...serverData.meme.likes];                                     // Get shallow copy on likes array and set to new state
                        state.isUserAlreadyLiked = !likeDislikeState.isUserAlreadyLiked;                // Change state of the current user is liked or not
                        state.isUserAlreadyDisliked = false;                                            // Ensure isUserAlreadyDisliked is false when liking (to avoid race conditions)
                        return { ...state };                                                            // Return state with a new reference to update new values
                    });
                })
                .catch(error => setServerMessage({ error: error.message }))
                .finally(() => setIsLoading(false));
        } else {
            Promise.all([                                                                               // Send two requests at the same time
                likeDislikeState.dislikeHandler(),
                likeDislikeState.likeHandler()
            ]);
        }
    };

    return (
        <>
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
            {!serverMessage?.error && (
                <p>
                    {isLoading ? (
                        <Loading width="50px" height="50px" />
                    ) : (
                        <button
                            onClick={likeHandler}
                            className={`${styles['btn-like']} ${likeDislikeState.isUserAlreadyLiked && styles['liked']}`}
                        >
                            <i className="btn fa-solid fa-thumbs-up"></i>
                        </button>
                    )}
                </p>
            )}
        </>
    );
}