import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ListUserMemes.module.css';
import { endpoint } from '../../../core/environments/constants';
import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';

export default function ListUserMemes() {
    const [currenEndPointForUserMemes, setCurrenEndPointForUserMemes] = useState('');   // Use to save an endpoint for the current user
    const [fetchedMemes, setFetchedMemes] = useState([]);                               // Use to get details about the current user from the fetched memes
    const [userDetails, setUserDetails] = useState({});                                 // Use to display details about the current user

    const { userId } = useParams('userId');                                             // Get userId from query params

    useEffect(() => {
        // Add page title
        document.title = `${userDetails?.username ? `${userDetails.username}'s` : 'User'} memes`;

        // Set end point to get all the memes for the user
        setCurrenEndPointForUserMemes(endpoint.getMemeForUserById(userId));

        setUserDetails(fetchedMemes);

    }, [fetchedMemes]);

    return (
        <>
            <div className={styles['user-card']}>
                <div className={styles['user-card-header']}>
                    <h1>{`Explore ${userDetails?.username}'s Collection`}</h1>
                </div>
                <div className={styles['user-card-content']}>
                    <p><i className="fa-regular fa-star"></i> Rating: {userDetails?.rating} points</p>
                    <p><i className="fa-regular fa-images"></i> Number of Memes: {userDetails?.userMemesCount}</p>
                </div>
                <div className={styles['user-card-footer']}>
                    <p>Joined: {userDetails?.createdAt}</p>
                </div>
            </div>

            {currenEndPointForUserMemes && <InfiniteScrollComponent endpoint={currenEndPointForUserMemes} setFetchedMemes={setFetchedMemes} />}
        </>
    );
}