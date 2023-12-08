/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './ListComments.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useModal } from '../../../core/hooks/useModal';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import AddCommentModal from '../add-comment/AddCommentModal';
import EditCommentModal from '../edit-comment/EditCommentModal';
import DeleteCommentModal from '../delete-comment/DeleteCommentModal';

export default function ListComments({ memeInfo, allComments, setAllComments }) {
    const [commentDetails, setCommentDetails] = useState({});                                           // Use to show details for one comment              
    const [userDetails, setUserDetails] = useState({});                                                 // Use of customer details to access various functionalities
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();
    const [isShownAddCommentModal, setIsShownAddCommentModal] = useModal();                             // Show hide modal for add comment
    const [isShownEditCommentModal, setIsShownEditCommentModal] = useModal();                           // Show hide modal for edit comment
    const [isShownDeleteCommentModal, setIsShownDeleteCommentModal] = useModal();                       // Show hide modal for delete comment
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

        getAllComments();

    }, []);

    const getAllComments = () => {                                                                      // Get all comments for meme
        setIsLoading(true);
        api.get(endpoint.getAllCommentsForMeme(memeInfo._id))
            .then(comments => setAllComments(comments))
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    const editCommentHandler = (comment) => {                                                           // Get one comment and show a edit modal
        if (!isShownEditCommentModal) {                                                                 // If the modal is shown not set again comment
            setCommentDetails(comment);
            setIsShownEditCommentModal();
        }

        setIsShownEditCommentModal();                                                                   // Hide modal
    };

    const deleteCommentHandler = (comment) => {                                                         // Get one comment and show a delete modal
        if (!isShownDeleteCommentModal) {                                                               // If the modal is shown not set again comment
            setCommentDetails(comment);
            setIsShownDeleteCommentModal();
        }

        setIsShownDeleteCommentModal();                                                                 // Hide modal
    };

    return (
        <div className={styles['all-comments']}>
            <div className={styles['comments-wrapper-heading']}>
                <h3>Comments</h3>
            </div>

            {isLoading && <Loading />}
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {allComments.length > 0
                ?
                (
                    allComments.map(comment => (
                        <div className={styles['comment']} key={comment._id}>
                            <div className={styles['comment-author-wrapper']}>

                                <p className={styles['comment-author']}><Link to={`/memes/user-memes/${comment.userId._id}`}><i className="fa-solid fa-at"></i> {comment.userId.username}</Link></p>
                                <div className={styles['comment-buttons']}>

                                    <p className={styles['comment-time']}>
                                        <time>
                                            {
                                                new Date(comment?.createdAt !== comment?.updatedAt ? comment?.updatedAt : comment?.createdAt)
                                                    .toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                            }
                                        </time>
                                        {comment?.createdAt !== comment?.updatedAt && <sup>(edited)</sup>}
                                    </p>

                                    {
                                        (userDetails?._id === comment.userId._id) && (
                                            <>
                                                <button onClick={() => editCommentHandler(comment)} className={`btn ${styles['comment-edit']}`}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button onClick={() => deleteCommentHandler(comment)} className={`btn ${styles['comment-delete']}`}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </>
                                        )
                                    }

                                </div>
                            </div>

                            <p className={styles['comment-text']}>{comment.comment}</p>
                        </div>
                    ))
                )
                : <p className={styles['no-comments']}> No comments yet.
                    {
                        (userDetails?._id !== memeInfo.author._id) &&
                        (
                            <button onClick={setIsShownAddCommentModal}
                                className={styles['btn-add-new-comment']}>
                                <i className="btn fa-solid fa-comment-medical"></i>
                            </button>
                        )
                    }
                </p>
            }

            {isShownAddCommentModal && <AddCommentModal modalHandler={setIsShownAddCommentModal} memeId={memeInfo._id} setNewCommentHandler={setAllComments} />}
            {isShownEditCommentModal && <EditCommentModal modalHandler={setIsShownEditCommentModal} commentDetails={commentDetails} setUpdatedCommentHandler={setAllComments} />}
            {isShownDeleteCommentModal && <DeleteCommentModal modalHandler={setIsShownDeleteCommentModal} commentDetails={commentDetails} setDeletedCommentHandler={setAllComments} />}
        </div>
    );
}