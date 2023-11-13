/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './CardMeme.module.css';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';
import formatDateToTimeAgo from '../../../utils/formatDateToTimeAgo';

import Rating from '../../rating/Rating';
import AddCommentModal from '../../comment/add-comment/AddCommentModal';
import DeleteMemeModal from '../delete-meme/DeleteMemeModal';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';


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
}) {
    const [userDetails, setUserDetails] = useState({});                                                 // Use to show user details
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();
    const { isLoggedIn, getUserDetails, addUserSession, getUserToken } = useAuthContext();

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

    }, []);

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
                    <time>{formatDateToTimeAgo(createdAt)}</time>
                    <span>ago</span>
                </p>

                <div className={styles['card-meme-info']}>
                    <p className={styles['category']}>Category: <Link to={`/memes/catalog?category=${category}`}>{category}</Link></p>
                    <p className={styles['info']}><i className="fa-regular fa-eye"></i> {views}</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> {likes.length}</p>
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
                            <p><a className={`btn ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
                            <p><a className={`btn ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
                            <p><a className={`btn ${styles['comment']}`} href="#"><i className="fa-solid fa-message"></i></a></p>
                            <p><a className={`btn ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p>
                        </>
                    }

                    <label htmlFor="modal-toggle-share" className={`btn ${styles['share']} ${styles['modal-button']}`}><i
                        className="fa-solid fa-share-nodes"></i></label>
                </footer>

                : null
            }

        </article>
    );
}


// const [isShownAddCommentModal, setIsShownAddCommentModal] = useModal();                 // Show hide modal for add comment
// {isShownAddCommentModal && <AddCommentModal modalHandler={setIsShownAddCommentModal} memeId={memeInfo._id} />}
// <DeleteMemeModal />
// <AddCommentModal />