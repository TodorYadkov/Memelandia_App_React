import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ListUserMemes.module.css';
import { endpoint } from '../../../core/environments/constants';
import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';
import { scrollToTop } from '../../../utils/scrollToTop';

import Rating from '../../rating/Rating';

export default function ListUserMemes() {
    const [currenEndPointForUserMemes, setCurrenEndPointForUserMemes] = useState('');                   // Use to save an endpoint for the current user
    const [fetchedMeme, setFetchedMeme] = useState([]);                                                 // Use to get details about the current user from the fetched memes
    const [userDetails, setUserDetails] = useState({});                                                 // Use to display details about the current user

    const { userId } = useParams('userId');                                                             // Get userId from query params

    useEffect(() => {
        document.title = `${userDetails?.username ? `${userDetails.username}'s` : 'User'} memes`;       // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        setCurrenEndPointForUserMemes(endpoint.getMemeForUserById(userId));                             // Set endpoint to get all the memes for the user

        setUserDetails(fetchedMeme);                                                                    // Set user details from InfiniteScrollComponent

    }, [fetchedMeme]);

    return (
        <div className='max-width'>
            <div className={styles['user-card']}>
                <div className={styles['user-card-header']}>
                    <h1>Explore <span>{userDetails?.username}</span>&apos;s Collection</h1>
                </div>
                <div className={styles['user-card-content']}>
                    <div className={styles['user-rating']}>
                        <Rating rating={userDetails?.rating} />
                        <p>Rating: <span>{userDetails?.rating}</span> points</p>
                    </div>
                    <p>
                        <i className="fa-regular fa-images"></i> Number of Memes: <span>{userDetails?.userMemesCount}</span>
                    </p>
                </div>
                <div className={styles['user-card-footer']}>
                    <p>Joined: {new Date(userDetails?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {currenEndPointForUserMemes && <InfiniteScrollComponent endpoint={currenEndPointForUserMemes} setFetchedMeme={setFetchedMeme} />}
        </div>
    );
}