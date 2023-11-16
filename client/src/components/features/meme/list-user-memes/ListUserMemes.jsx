import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ListUserMemes.module.css';
import { endpoint } from '../../../core/environments/constants';
import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';
import { scrollToTop } from '../../../utils/scrollToTop';

import Rating from '../../rating/Rating';
import ScrollToTopButton from '../../../shared/scroll-to-top-button/ScrollToTopButton';

export default function ListUserMemes() {
    const [currenEndPointForUserMemes, setCurrenEndPointForUserMemes] = useState('');                   // Use to save an endpoint for the current user
    const [userDetailsFromFetchedMeme, setUserDetailsFromFetchedMeme] = useState({});                   // Use to get details about the current user from the fetched memes
    const [userDetails, setUserDetails] = useState({});                                                 // Use to display details about the current user
    const [showUserDetails, setShowUserDetails] = useState(false);                                      // Use to display a message that the current user has no memes or current user details

    const { userId } = useParams('userId');                                                             // Get userId from query params

    useEffect(() => {
        document.title = `${userDetails?.username ? `${userDetails.username}'s` : 'User'} memes`;       // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        setCurrenEndPointForUserMemes(endpoint.getMemeForUserById(userId));                             // Set endpoint to get all the memes for the user

        setUserDetails(userDetailsFromFetchedMeme);                                                     // Set user details from InfiniteScrollComponent
        userDetailsFromFetchedMeme?.username && setShowUserDetails(true);

    }, [userDetailsFromFetchedMeme]);

    return (
        <div className='max-width'>
            {showUserDetails
                ?
                <div className={styles['user-card']}>
                    <div className={styles['user-card-header']}>
                        <h1>Explore <span>{userDetails?.username ? userDetails.username : 'User'}</span>&apos;s Collection</h1>
                    </div>
                    <div className={styles['user-card-content']}>
                        <div className={styles['user-rating']}>
                            <Rating rating={userDetails?.rating ? userDetails?.rating : 0} />
                            <p>Rating: <span className={styles['user-card-content-span']}>{userDetails?.rating ? userDetails.rating : '0'}</span> points</p>
                        </div>
                        <p>
                            <i className="fa-regular fa-images"></i> Number of Memes: <span className={styles['user-card-content-span']}>{userDetails?.userMemesCount ? userDetails?.userMemesCount : 0}</span>
                        </p>
                    </div>
                    <div className={styles['user-card-footer']}>
                        {userDetails?.createdAt && <p>Joined: {new Date(userDetails?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    </div>
                </div>
                :
                <h3 className={styles['no-content-user']}>This user has no memes added yet! <i className="fa-solid fa-heart-crack"></i></h3>
            }

            <ScrollToTopButton />
            {currenEndPointForUserMemes && <InfiniteScrollComponent endpoint={currenEndPointForUserMemes} setUserDetailsFromFetchedMeme={setUserDetailsFromFetchedMeme} />}
        </div>
    );
}