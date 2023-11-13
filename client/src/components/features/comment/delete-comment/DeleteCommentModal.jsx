/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from './DeleteCommentModal.module.css';
import { useApi } from '../../../core/hooks/useApi';

import Message from '../../../shared/messages/Message';
import Loading from '../../../shared/loader/Loading';
import { endpoint } from '../../../core/environments/constants';

export default function DeleteCommentModal({ modalHandler, commentDetails, setDeletedCommentHandler }) {
    const [isDeleted, setIsDeleted] = useState(false);                                                  // Use to disable the delete button after deleting a comment
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                     // Use to display various messages from the server

    const api = useApi();

    const deleteHandler = () => {                                                                       // Delete comment
        setIsLoading(true);
        api.delete(endpoint.deleteComment(commentDetails._id))
            .then(deletedComment => {
                setIsDeleted(true); // Disable delete button
                setServerMessage({ success: 'Comment is successfully deleted! 😪' });
                setDeletedCommentHandler(allComments => [...allComments.filter(c => c._id !== deletedComment.deletedComment._id)]); // Delete comment from a state
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="comment-modal">
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-trash"></i> Confirm delete</h4>
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                    </div>
                    <div className="modal-content">
                        {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                        {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}

                        <form className={styles['form']}>
                            <div className="control-comment">
                                {/* Comment */}
                                <label htmlFor="comment" className={styles['textarea-label']}>Comment</label>
                                <textarea
                                    defaultValue={commentDetails?.comment}
                                    className={styles['textarea']}
                                    id="comment"
                                    rows="5"
                                    cols="60"
                                    name="comment"
                                    type="text"
                                    disabled
                                >
                                </textarea>
                            </div>
                            <div className={styles['form-buttons']}>

                                {isLoading
                                    ? <Loading width="50px" height="50px" />
                                    : <button
                                        onClick={deleteHandler}
                                        type='button'
                                        disabled={isDeleted}
                                        className={`btn ${styles['btn-delete']}`}>
                                        <i className="fa-solid fa-triangle-exclamation"></i> Delete</button>
                                }

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}