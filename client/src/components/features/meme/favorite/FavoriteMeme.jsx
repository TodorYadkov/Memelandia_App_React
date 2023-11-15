/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from './FavoriteMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';

import Message from '../../../shared/messages/Message';
import Loading from '../../../shared/loader/Loading';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

export default function FavoriteMeme({ memeId, isFavorite, setIsFavorite }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });

    const api = useApi();
    const { addUserSession, getUserDetails, getUserToken } = useAuthContext();

    const favoriteHandler = () => {
        setIsLoading(true);
        api.get(endpoint.addRemoveFavoriteMeme(memeId))
            .then(serverData => {
                setIsFavorite(!isFavorite);                                                             // Change state of the button of is favorite or no
                const updatedFavoriteList =                                                             // Save to variable updated favorite array
                    serverData.message === 'Successfully added new favorite meme.'                      // Check which action is enabled
                        ? [...getUserDetails.favorite, serverData.meme]                                 // Add current favorite meme to global state
                        : getUserDetails.favorite.filter(m => m._id !== serverData.meme._id);           // Remove current meme from the global state

                addUserSession({                                                                        // addUserSession is a function that update state
                    accessToken: getUserToken,                                                          // Accepts an object with accessToken and userDetails
                    userDetails: {
                        ...getUserDetails,
                        favorite: updatedFavoriteList                                                   // Add in global state updated data
                    }
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
                            onClick={favoriteHandler}
                            className={`${styles['btn-favorite']} ${isFavorite && styles['favorite']}`}
                        >
                            <i className="btn fa-solid fa-heart"></i>
                        </button>
                    )}
                </p>
            )}
        </>
    );

}