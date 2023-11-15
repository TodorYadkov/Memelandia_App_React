/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import styles from './DislikeMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';

import Message from '../../../shared/messages/Message';
import Loading from '../../../shared/loader/Loading';

export default function DislikeMeme({ memeId, likeDislikeState, setLikeDislikeState }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const api = useApi();

    useEffect(() => {
        setLikeDislikeState(state => ({ ...state, dislikeHandler }));                                   // Add dislike handler to state to be used in LikeMeme

    }, []);

    const dislikeHandler = () => {
        const isLiked = likeDislikeState.isUserAlreadyLiked;                                            // Get the user's current likes status
        const isDisliked = likeDislikeState.isUserAlreadyDisliked;                                      // Get the user's current dislikes status
        const btnAreClicked = isLiked && isDisliked;                                                    // Get the current state of the like and dislike buttons 
        const btnAreNotClicked = !isLiked && !isDisliked;
        const newIsDisliked = isDisliked && !isLiked;                                                   // Handle the scenario where clicking on dislike removes like

        if ((btnAreNotClicked || newIsDisliked) || btnAreClicked) {
            setIsLoading(true);
            api.get(endpoint.addRemoveDislikeMeme(memeId))
                .then(serverData => {
                    setLikeDislikeState(state => {
                        state.dislikeArr = [...serverData.meme.dislikes];                               // Get shallow copy on dislikes array and set to new state
                        state.isUserAlreadyDisliked = !likeDislikeState.isUserAlreadyDisliked;          // Change state of the current user is disliked or not
                        state.isUserAlreadyLiked = false;                                               // Ensure isUserAlreadyLiked is false when disliking (to avoid race conditions)
                        return { ...state };                                                            // Return state with a new reference to update new values
                    });
                })
                .catch(error => setServerMessage({ error: error.message }))
                .finally(() => setIsLoading(false));
        } else {
            Promise.all([                                                                               // Send two requests at the same time
                likeDislikeState.likeHandler(),
                likeDislikeState.dislikeHandler()
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
                            onClick={dislikeHandler}
                            className={`${styles['btn-dislike']} ${likeDislikeState.isUserAlreadyDisliked && styles['disliked']}`}
                        >
                            <i className="btn fa-solid fa-thumbs-down"></i>
                        </button>
                    )}
                </p>
            )}
        </>
    );
}