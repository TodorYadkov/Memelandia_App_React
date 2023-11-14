/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from './LikeMeme.module.css';
import { useApi } from '../../core/hooks/useApi';
import { endpoint } from '../../core/environments/constants';

import Message from '../../shared/messages/Message';
import Loading from '../../shared/loader/Loading';


export default function LikeMeme({ memeId, likeState, setLikeState }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const api = useApi();

    const likeHandler = () => {
        setIsLoading(true);
        api.get(endpoint.addRemoveLikeMeme(memeId))
            .then(serverData => {
                setLikeState(state => {
                    state.likeArr = [...serverData.meme.likes];                                         // Get shallow copy on likes array and set to new state
                    state.isUserAlreadyLiked = !likeState.isUserAlreadyLiked;                           // Change state of the current user is liked or not
                    return { ...state };                                                                // Return state with a new reference to update new values
                });
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
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
                            className={`${styles['btn-like']} ${likeState.isUserAlreadyLiked && styles['liked']}`}
                        >
                            <i className="btn fa-solid fa-thumbs-up"></i>
                        </button>
                    )}
                </p>
            )}
        </>
    );
}