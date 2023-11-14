/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './CardMeme.module.css';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';
import formatDateToTimeAgo from '../../../utils/formatDateToTimeAgo';
import { useModal } from '../../../core/hooks/useModal';

import Rating from '../../rating/Rating';
import AddCommentModal from '../../comment/add-comment/AddCommentModal';
import DeleteMemeModal from '../delete-meme/DeleteMemeModal';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import LikeMeme from '../../like/LikeMeme';

export default function CardMeme({
    _id,
    name,
    author,
    category,
    dislikes,
    imageUrl,
    likes,
    rating,
    views,
    createdAt,
    updatedAt,
    setNewCommentHandler,                                                                               // Optional handler, when adding a new comment, updates list of all comments (state)
}) {
    const [userDetails, setUserDetails] = useState({});                                                 // Use to show user details
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server
    const [likeState, setLikeState] = useState({                                                        // Use to keep a state of likes
        likeArr: likes,                                                                                 // Use to add or remove from the state of a user after a request to the server
        isUserAlreadyLiked: false                                                                       // Initial state of the user
    });

    const api = useApi();
    const { isLoggedIn, getUserDetails, addUserSession, getUserToken } = useAuthContext();
    const [isShownAddCommentModal, setIsShownAddCommentModal] = useModal();                             // Show hide modal for add comment

    useEffect(() => {
        if (getUserDetails['_id'] && isLoggedIn) {                                                      // If the user has refreshed their browser, get their data from the server
            setUserDetails(getUserDetails);                                                             // Get user details from context (in memory)

        } else if (isLoggedIn) {
            setIsLoading(true);
            api.get(endpoint.getUserById)
                .then(userData => {
                    setUserDetails(userData);
                    addUserSession({                                                                    // Store user data for optimized next request, don't get details from server again
                        accessToken: getUserToken,
                        userDetails: { ...userData }
                    });
                })
                .catch(error => setServerMessage({ error: error.message }))
                .finally(() => setIsLoading(false));
        }

        setLikeState(state => ({ ...state, isUserAlreadyLiked: likes.includes(userDetails._id) }));     // Check for the status of the current user, whether he has liked the current card

    }, [userDetails]);

    const currentUser = {                                                                               // Get state of the current user
        isLogged: isLoggedIn,
        isOwner: userDetails?._id === author?._id,
    };

    return (
        <article className={styles['card']}>
            {isLoading && <Loading />}
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            <header className={styles['card-header']}>
                <h4><Link to={`/memes/details/${_id}`}>{name}</Link></h4>

                <p className={styles['card-author-name']}>
                    <span>By:</span>
                    <Link
                        to={`/memes/user-memes/${author._id}`}
                        className={styles['card-author-link']}>
                        <i className="fa-solid fa-at"></i> {author.username}
                    </Link>
                    <span>,</span>
                    <time>{createdAt !== updatedAt ? formatDateToTimeAgo(updatedAt) : formatDateToTimeAgo(createdAt)}</time>
                    {createdAt !== updatedAt ? <sup>(edited)</sup> : <span>ago</span>}
                </p>

                <div className={styles['card-meme-info']}>
                    <p className={styles['category']}>Category: <Link to={`/memes/catalog?category=${category}`}>{category}</Link></p>
                    <p className={styles['info']}><i className="fa-regular fa-eye"></i> {views}</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> {likeState.likeArr.length}</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> {dislikes.length}</p>

                    <Rating rating={rating} />
                </div>
            </header>
            <div className={styles['card-img-wrapper']}>

                <Link to={`/memes/details/${_id}`}><img src={imageUrl} alt={name} /></Link>
            </div>

            {currentUser?.isLogged
                ?
                <footer className={styles['card-footer']}>
                    {currentUser?.isOwner
                        ?
                        <>
                            <p><a className={`btn ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
                            <label htmlFor="modal-toggle-meme-delete" className={`btn ${styles['delete']} ${styles['modal-button']}`}><i className="fa-solid fa-trash"></i></label>
                        </>
                        :
                        <>
                            <LikeMeme memeId={_id} likeState={likeState} setLikeState={setLikeState} />
                            <p><a className={`btn ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
                            <p><button onClick={setIsShownAddCommentModal} className={styles['btn-add-comment']}><i className="btn fa-solid fa-message"></i></button></p>
                            <p><a className={`btn ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p>
                        </>
                    }

                    <label htmlFor="modal-toggle-share" className={`btn ${styles['share']} ${styles['modal-button']}`}><i
                        className="fa-solid fa-share-nodes"></i></label>
                </footer>

                : null
            }

            {isShownAddCommentModal &&
                <AddCommentModal
                    memeId={_id}
                    modalHandler={setIsShownAddCommentModal}
                    {...(setNewCommentHandler && { setNewCommentHandler })} />
            }
        </article>
    );
}