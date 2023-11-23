/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import styles from './Profile.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useModal } from '../../../core/hooks/useModal';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { endpoint } from '../../../core/environments/constants';
import { scrollToTop } from '../../../utils/scrollToTop';

import Rating from '../../rating/Rating';
import CardMeme from '../../meme/card-meme/CardMeme';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import EditProfileModal from '../edit-profile/EditProfileModal';
import ScrollToTopButton from '../../../shared/scroll-to-top-button/ScrollToTopButton';
import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';

export default function Profile() {
    const [myFavoriteMemes, setMyFavoriteMemes] = useState([]);                                         // Use to show user favorite meme
    const [isShownMyFavoriteMemes, setIsShownMyFavoriteMemes] = useState(false);                        // Use to change which meme to show
    const [userDetails, setUserDetails] = useState({});                                                 // Use to show user details
    const [userHasId, setUserHasId] = useState(false);                                                  // Used when the user has no ID. After receiving it, I take all the memes from the server
    const [isLoadingUser, setIsLoadingUser] = useState(false);                                          // Use when load data from user (show spinner on different place)
    const [isLoadingMeme, setIsLoadingMeme] = useState(false);                                          // Use when load data from meme (show spinner on different place)
    const [serverMessage, setServerMessage] = useState({ errorUser: '', errorMeme: '' });               // Use to display various messages from the server in different place
    const [endPointForUserMemes, setEndPointForUserMemes] = useState('');                               // Use to get all the user's memes from the server

    const api = useApi();
    const { getUserDetails, addUserSession, getUserToken } = useAuthContext();
    const [isShownModal, setIsShownModal] = useModal();                                                 // Show hide modal for edit user profile

    useEffect(() => {
        document.title = `Profile of ${getUserDetails['username']                                       // Add page title
            ? getUserDetails['username']
            : userDetails.username}`;
        scrollToTop();                                                                                  // Scroll to the top of the page

        if (getUserDetails['_id']) {                                                                    // If the user has refreshed their browser, get their data from the server
            setUserDetails(getUserDetails);                                                             // Get user details from context (in memory)
        } else {
            getUserData('user');                                                                        // Get user details from server
        }

        if (getUserDetails['_id'] || userHasId) {                                                       // If not userId in context data get after request to the DB                                                                                                          
            const endPointWithUserID = endpoint.getMemeForUserById(getUserDetails['_id']                // Create an endpoint with userId, to get all user memes from the server.      
                ? getUserDetails['_id']                                                                 // Get user ID from context                                                           
                : userDetails._id);                                                                     // Get user ID after request to the server
            setEndPointForUserMemes(endPointWithUserID);
        }

    }, [userHasId, getUserDetails]);

    const showFavoriteMemes = () => {                                                                   // Get and show favorite memes
        getUserData('meme');                                                                            // Pass 'meme' as a argument to indicate loading meme data
        toggleMemes();
    };

    const toggleMemes = () => {                                                                         // Show or hide which memes to show (favorites or user created)
        setIsShownMyFavoriteMemes(!isShownMyFavoriteMemes);
    };

    const getUserData = (currentState) => {                                                             // Get user data to invoke - valid argument are "user" and "meme"
        const setLoadingState = currentState === 'user' ? setIsLoadingUser : setIsLoadingMeme;          // Use the correct loading state to show the spinner in a different places

        setLoadingState(true);
        api.get(endpoint.getUserById)
            .then(userData => {
                setUserDetails(userData);
                currentState === 'user' && setUserHasId(true);                                          // Use when the user has no ID. Set a new status to true to get all of the user's memes
                currentState === 'meme' && setMyFavoriteMemes(userData.favorite);                       // Save user's favorite memes in state
                addUserSession({                                                                        // Store global user data for optimized next request, don't get details from server again
                    accessToken: getUserToken,
                    userDetails: { ...userData }
                });
            })
            .catch(error => currentState === 'meme'
                ? setServerMessage({ errorMeme: error.message })                                        // Use this to display a message below the user's data
                : setServerMessage({ errorUser: error.message })                                        // Use this to display a message in the user's details
            )
            .finally(() => setLoadingState(false));
    };

    return (
        <section className={`${styles['profile']} max-width`}>
            <div className={styles['profile-details']}>
                <div className={styles['profile-heading']}>

                    <h1><i className="fa-solid fa-user"></i> <span>User</span> <span>Profile</span></h1>
                    <Rating rating={userDetails?.rating} />

                </div>

                {(serverMessage?.errorUser && !isLoadingUser) && <Message type="error" message={serverMessage.errorUser} />}
                {(serverMessage?.errorUser && !isLoadingUser)
                    ? <Loading />
                    : <>
                        <div className={styles['profile-header']}>
                            <p>
                                <span className={styles['profile-name']}>{userDetails?.name}</span>
                                <span className={styles['profile-email']}>{userDetails?.email}</span>
                                <span className={styles['profile-username']}>({userDetails?.username})</span>
                                <span className={styles['profile-age']}>{userDetails?.age} years old</span>
                            </p>
                        </div>

                        <div className={styles['profile-stat']}>
                            <div className={styles['profile-stat-container']}>
                                {/* Rating */}
                                <div className={styles['box']}>
                                    <div className={styles['shadow']}></div>
                                    <div className={styles['content']}>
                                        <div className={`${styles['percent']} ${userDetails?.rating < 0 ? styles['red'] : ''}`} data-text="Rating" style={{ '--num': (userDetails?.rating < -100) ? -100 : (userDetails?.rating > 100) ? 100 : userDetails?.rating }}>
                                            <div className={styles['dot']}></div>
                                            <svg>
                                                <circle cx="70" cy="70" r="70"></circle>
                                                <circle cx="70" cy="70" r="70"></circle>
                                            </svg>
                                        </div>
                                        <div className={`${styles['number']} ${userDetails?.rating < 0 ? styles['red'] : ''}`}>
                                            <h2>{(userDetails?.rating < -100) ? -100 : (userDetails?.rating > 100) ? 100 : userDetails?.rating}<span>%</span></h2>
                                        </div>
                                    </div>
                                </div>
                                {/* Count Memes */}
                                <div className={styles['box']}>
                                    <div className={styles['shadow']}></div>
                                    <div className={styles['content']}>
                                        <div className={styles['percent']} data-text="Memes" style={{ '--num': userDetails?.memesCount > 100 ? 100 : userDetails?.memesCount }}>
                                            <div className={styles['dot']}></div>
                                            <svg>
                                                <circle cx="70" cy="70" r="70"></circle>
                                                <circle cx="70" cy="70" r="70"></circle>
                                            </svg>
                                        </div>
                                        <div className={styles['number']}>
                                            <h2>{userDetails?.memesCount > 100 ? 100 : userDetails?.memesCount}<span>%</span></h2>
                                        </div>
                                    </div>
                                </div>
                                {/* Count Post */}
                                <div className={styles['box']}>
                                    <div className={styles['shadow']}></div>
                                    <div className={styles['content']}>
                                        <div className={styles['percent']} data-text="Post" style={{ '--num': userDetails?.commentsCount > 100 ? 100 : userDetails?.commentsCount }}>
                                            <div className={styles['dot']}></div>
                                            <svg>
                                                <circle cx="70" cy="70" r="70"></circle>
                                                <circle cx="70" cy="70" r="70"></circle>
                                            </svg>
                                        </div>
                                        <div className={styles['number']}>
                                            <h2>{userDetails?.commentsCount > 100 ? 100 : userDetails?.commentsCount}<span>%</span></h2>
                                        </div>
                                    </div>
                                </div>
                                {/* Count Fav */}
                                <div className={styles['box']}>
                                    <div className={styles['shadow']}></div>
                                    <div className={styles['content']}>
                                        <div className={styles['percent']} data-text="Fav" style={{ '--num': userDetails?.favorite?.length > 100 ? 100 : userDetails?.favorite?.length }}>
                                            <div className={styles['dot']}></div>
                                            <svg>
                                                <circle cx="70" cy="70" r="70"></circle>
                                                <circle cx="70" cy="70" r="70"></circle>
                                            </svg>
                                        </div>
                                        <div className={styles['number']}>
                                            <h2>{userDetails?.favorite?.length > 100 ? 100 : userDetails?.favorite?.length}<span>%</span></h2>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className={styles['profile-buttons']}>
                            <button onClick={setIsShownModal} className={`btn ${styles['btn']} ${styles['btn-user']}`}><i className="fa-solid fa-user-pen"></i> Edit Profile</button>
                            <button
                                onClick={isShownMyFavoriteMemes ? toggleMemes : showFavoriteMemes}
                                className={`btn ${styles['btn']} ${styles['btn-user']}`}>
                                <i className="fa-solid fa-heart"></i> {isShownMyFavoriteMemes ? 'Hide' : 'View'} Favorite
                            </button>
                        </div>
                    </>
                }
                <div className={styles['profile-footer']}>
                    <p className={styles['profile-join']}>Joined: {new Date(userDetails?.createdAt).toLocaleString('en-US',
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}</p>
                    <p className={styles['profile-update']}>Updated: {new Date(userDetails?.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}</p>
                </div>
            </div>

            <div className={styles['profile-memes']}>

                {isLoadingMeme
                    ? <Loading />
                    : <>
                        {isShownMyFavoriteMemes &&
                            <>
                                <h2 className={styles['profile-memes-heading']}>Favorite Memes</h2>
                                {(serverMessage?.errorMeme && !isLoadingUser) && <Message type="error" message={serverMessage.errorMeme} />}

                                {myFavoriteMemes?.length !== 0
                                    ? myFavoriteMemes.map(m => <CardMeme key={m._id} {...m} />)
                                    : <h3 className={styles['no-favorite-memes-h3']}><span>Your collection is waiting!</span> No favorite memes have been added yet.</h3>}
                            </>
                        }

                        {!isShownMyFavoriteMemes &&
                            <>
                                <h2 className={styles['profile-memes-heading']}>My Memes</h2>

                                {endPointForUserMemes && <InfiniteScrollComponent endpoint={endPointForUserMemes} />}
                            </>
                        }
                    </>
                }

            </div >

            <ScrollToTopButton />

            {isShownModal && <EditProfileModal userDetails={userDetails} setUserDetails={setUserDetails} modalHandler={setIsShownModal} />}
        </section >
    );
}