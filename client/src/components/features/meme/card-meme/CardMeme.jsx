/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './CardMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useModal } from '../../../core/hooks/useModal';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import formatDateToTimeAgo from '../../../utils/formatDateToTimeAgo';

import Rating from '../../rating/Rating';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import LikeMeme from '../like/LikeMeme';
import DislikeMeme from '../dislike/DislikeMeme';
import FavoriteMeme from '../favorite/FavoriteMeme';
import EditMemeModal from '../edit-meme/EditMemeModal';
import ShareMemeModal from '../share-meme/ShareMemeModal';
import DeleteMemeModal from '../delete-meme/DeleteMemeModal';
import AddCommentModal from '../../comment/add-comment/AddCommentModal';

export default function CardMeme({
    _id,                                                                                                // Meme property
    name,                                                                                               // Meme property
    author,                                                                                             // Meme property
    category,                                                                                           // Meme property
    dislikes,                                                                                           // Meme property
    imageUrl,                                                                                           // Meme property
    likes,                                                                                              // Meme property
    rating,                                                                                             // Meme property
    views,                                                                                              // Meme property
    createdAt,                                                                                          // Meme property
    updatedAt,                                                                                          // Meme property
    setNewCommentHandler,                                                                               // Optional handler, when adding a new comment, updates list of all comments (state)
    onDeleteMeme,                                                                                       // Use to rerender parent component when some meme is deleted
}) {
    const [userDetails, setUserDetails] = useState({});                                                 // Use to show user details
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server
    const [isFavorite, setIsFavorite] = useState(false);                                                // Use to add to favorites for each user
    const [memeDetails, setMemeDetails] = useState({                                                    // Set current meme details in state
        _id, name, author, category, dislikes, imageUrl, likes, rating, views, createdAt, updatedAt
    });
    const [likeDislikeState, setLikeDislikeState] = useState({                                          // Use to keep a state of likes and dislikes
        likeArr: likes,                                                                                 // Use to add or remove likes from the state of a user after a request to the server
        isUserAlreadyLiked: false,                                                                      // Initial like state of the user
        dislikeArr: dislikes,                                                                           // Use to add or remove dislikes from the state of a user after a request to the server
        isUserAlreadyDisliked: false                                                                    // Initial dislike state of the user
    });

    const api = useApi();
    const { isLoggedIn, getUserDetails, addUserSession, getUserToken } = useAuthContext();
    const [isShownAddCommentModal, setIsShownAddCommentModal] = useModal();                             // Show hide modal for add comment
    const [isShownShareModal, setIsShownShareModal] = useModal();                                       // Show hide modal for share meme
    const [isShownDeleteModal, setIsShownDeleteModal] = useModal();                                     // Show hide modal for edit meme
    const [isShownEditModal, setIsShownEditModal] = useModal();                                         // Show hide modal for edit meme

    useEffect(() => {
        if (getUserDetails['_id'] && isLoggedIn) {                                                      // If the user has refreshed their browser, get their data from the server
            setUserDetails(getUserDetails);                                                             // Get user details from context (in memory)

        } else if (isLoggedIn) {
            setIsLoading(true);
            api.get(endpoint.getUserById)                                                               // Get user details from server
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

        setLikeDislikeState(state => {                                                                  // Set State for likes and dislikes
            const currentState = {
                ...state,
                isUserAlreadyLiked: likes.includes(userDetails._id),                                    // Check for the status of the current user, whether he has liked the current card
                isUserAlreadyDisliked: dislikes.includes(userDetails._id)                               // Check for the status of the current user, whether he has disliked the current card
            };

            return currentState;
        });

        if (userDetails?.favorite) {
            setIsFavorite(userDetails.favorite.some(m => m._id === _id));                               // Use to set the state of the favorite
        }

    }, [userDetails]);

    const currentUser = {                                                                               // Get state of the current user
        isLogged: isLoggedIn,
        isOwner: userDetails?._id === author?._id,
    };

    const handleContextMenu = (e) => {                                                                  // Disable context menu with preventDefault
        e.preventDefault();
    };

    return (
        <article onContextMenu={handleContextMenu} className={styles['card']}>
            {isLoading && <Loading />}
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            <header className={styles['card-header']}>
                <h4><Link to={`/memes/details/${memeDetails._id}`}>{memeDetails.name}</Link></h4>

                <p className={styles['card-author-name']}>
                    <span>By:</span>
                    <Link
                        to={`/memes/user-memes/${memeDetails.author._id}`}
                        className={styles['card-author-link']}>
                        <i className="fa-solid fa-at"></i> {memeDetails.author.username}
                    </Link>
                    <span>,</span>
                    <time>{memeDetails.createdAt !== memeDetails.updatedAt
                        ? formatDateToTimeAgo(memeDetails.updatedAt)
                        : formatDateToTimeAgo(memeDetails.createdAt)
                    }</time>
                    {memeDetails.createdAt !== memeDetails.updatedAt ? <sup>(edited)</sup> : <span>ago</span>}
                </p>

                <div className={styles['card-meme-info']}>
                    <p className={styles['category']}>Category: <Link to={`/memes/catalog?category=${memeDetails.category}`}>{memeDetails.category}</Link></p>
                    <p className={styles['info']}><i className="fa-regular fa-eye"></i> {memeDetails.views}</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> {likeDislikeState.likeArr.length}</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> {likeDislikeState.dislikeArr.length}</p>

                    <Rating rating={memeDetails.rating} />
                </div>
            </header>
            <div className={styles['card-img-wrapper']}>

                <Link to={`/memes/details/${memeDetails._id}`}><img src={memeDetails.imageUrl} alt={memeDetails.name} /></Link>
            </div>

            {currentUser?.isLogged
                ?
                <footer className={styles['card-footer']}>
                    {currentUser?.isOwner
                        ?
                        <>
                            <button onClick={setIsShownEditModal} className={styles['btn-edit-meme']}><i className="btn fa-solid fa-pen-to-square"></i></button>
                            <button onClick={setIsShownDeleteModal} className={styles['btn-delete-meme']}><i className="btn fa-solid fa-trash"></i></button>
                        </>
                        :
                        <>
                            <LikeMeme memeId={memeDetails._id} likeDislikeState={likeDislikeState} setLikeDislikeState={setLikeDislikeState} />
                            <DislikeMeme memeId={memeDetails._id} likeDislikeState={likeDislikeState} setLikeDislikeState={setLikeDislikeState} />
                            <button onClick={setIsShownAddCommentModal} className={styles['btn-add-comment']}><i className="btn fa-solid fa-message"></i></button>
                            <FavoriteMeme memeId={memeDetails._id} isFavorite={isFavorite} setIsFavorite={setIsFavorite} setUserDetails={setUserDetails} />
                        </>
                    }

                    <button onClick={setIsShownShareModal} className={styles['btn-share']}><i className="btn fa-solid fa-share-nodes"></i></button>
                </footer>

                : null
            }

            {isShownAddCommentModal && (
                <AddCommentModal
                    memeId={memeDetails._id}
                    modalHandler={setIsShownAddCommentModal}
                    {...(setNewCommentHandler && { setNewCommentHandler })}
                />
            )}

            {isShownShareModal && (
                <ShareMemeModal
                    modalHandler={setIsShownShareModal}
                    imageUrl={memeDetails.imageUrl}
                />
            )}

            {isShownEditModal && (
                <EditMemeModal
                    modalHandler={setIsShownEditModal}
                    memeDetails={memeDetails}
                    setMemeDetails={setMemeDetails}
                />
            )}

            {isShownDeleteModal && (
                <DeleteMemeModal
                    modalHandler={setIsShownDeleteModal}
                    memeDetails={memeDetails}
                    onDeleteMeme={onDeleteMeme}
                />
            )}

        </article>
    );
}