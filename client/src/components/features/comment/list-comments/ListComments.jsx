/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './ListComments.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { endpoint } from '../../../core/environments/constants';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function ListComments({ comments }) {
    const [userDetails, setUserDetails] = useState({});                             // Use to show user details
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });               // Use to display various messages from the server

    const api = useApi();
    const { isLoggedIn, getUserDetails, addUserSession, getUserToken } = useAuthContext();

    useEffect(() => {

        // If the user has refreshed their browser, get their data from the server
        if (getUserDetails['_id'] && isLoggedIn) {
            setUserDetails(getUserDetails); // Get user details from context (in memory)

        } else if (isLoggedIn) {
            setIsLoading(true);
            api.get(endpoint.getUserById)
                .then(userData => {
                    setUserDetails(userData);
                    // Store user data for optimized next request, don't get details from server again
                    addUserSession({
                        accessToken: getUserToken,
                        userDetails: { ...userData }
                    });
                })
                .catch(error => setServerMessage({ error: error.message }))
                .finally(() => setIsLoading(false));
        }

    }, []);

    return (
        <div className={styles['all-comments']}>
            <div className={styles['comments-wrapper-heading']}>
                <h3>Comments</h3>
            </div>

            {isLoading && <Loading />}
            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {comments.length > 0
                ?
                (
                    comments.map((comment, index) => (
                        <div className={styles['comment']} key={index}>
                            <div className={styles['comment-author-wrapper']}>

                                <p className={styles['comment-author']}><Link to={`/memes/user-memes/${comment.userId._id}`}>{comment.userId.username}</Link></p>

                                <div className={styles['comment-buttons']}>

                                    <p><time>{new Date(comment?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></p>

                                    {
                                        userDetails?._id === comment.userId._id && (
                                            <>
                                                <label htmlFor="modal-toggle-comment-edit" className={`btn ${styles['btn']} ${styles['comment-edit']} ${styles['modal-button']}`}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </label>
                                                <label htmlFor="modal-toggle-comment-delete" className={`btn ${styles['btn']} ${styles['comment-delete']} ${styles['modal-button']}`}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </label>
                                            </>
                                        )
                                    }

                                </div>
                            </div>

                            <p className={styles['comment-text']}>{comment.comment}</p>

                        </div>
                    ))
                )
                :
                (
                    <p>No comments yet. <a href="#add-comment">Add a new comment</a></p>
                )
            }
        </div>
    );
}