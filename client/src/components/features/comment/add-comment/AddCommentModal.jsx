/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import styles from './AddCommentModal.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { trimInputData } from '../../../utils/trimInputData';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function AddCommentModal({ modalHandler, memeId, setNewCommentHandler }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                         // Use to display various messages from the server

    const api = useApi();
    const navigate = useNavigate();
    const { addUserSession, getUserDetails, getUserToken } = useAuthContext();

    // Use react-hook-form https://react-hook-form.com/docs/useform/register
    const { register, handleSubmit, formState: { errors, isValid, touchedFields, isSubmitting, isSubmitted } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: { 'comment': '' }
    });

    const submitHandler = (userInput) => {
        const trimmedInput = trimInputData(userInput);                                                      // Trim user input

        setIsLoading(true);
        api.post(endpoint.addNewComment(memeId), trimmedInput)
            .then(newComment => {
                setServerMessage({ success: 'Successfully added new comment! 😊' });
                setNewCommentHandler && setNewCommentHandler(allComments => [...allComments, newComment]);  // If new comment is added from details, add comment to the list
                addUserSession({                                                                            // addUserSession is a function that update state
                    accessToken: getUserToken,                                                              // Accepts an object with accessToken and userDetails
                    userDetails: {
                        ...getUserDetails,
                        commentsCount: getUserDetails.commentsCount + 1                                     // Increment global state with one
                    }
                });

                navigate(`/memes/details/${memeId}`);                                                       // After add new comment navigate to details
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="comment-modal">
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-comment-medical"></i> Add New Comment</h4>
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                    </div>
                    <div className="modal-content">
                        {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                        {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}

                        <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form']}>
                            <div className="control-comment">
                                {/* Comment */}
                                <label htmlFor="comment" className={styles['textarea-label']}>Comment</label>
                                <textarea
                                    {...register('comment', {
                                        required: {
                                            value: true,
                                            message: 'Comment is required'
                                        },
                                        maxLength: {
                                            value: 300,
                                            message: 'Comment must be a maximum of three hundred characters long'
                                        }
                                    })}
                                    className={`${styles['textarea']}
                                    ${(touchedFields?.comment && isValid)
                                            ? styles['valid']
                                            : errors?.comment ? styles['invalid'] : ''}`
                                    }
                                    id="comment"
                                    rows="5"
                                    cols="60"
                                    name="comment"
                                    type="text"
                                    placeholder='Add a new comment here'
                                    disabled={isSubmitted}
                                    required
                                    maxLength={300}
                                >
                                </textarea>
                                {errors?.comment && (<p className={styles['error-message']}><span>{errors.comment.message}</span></p>)}
                            </div>
                            <div className={styles['form-buttons']}>

                                {isLoading
                                    ? <Loading width="50px" height="50px" />
                                    : <button
                                        disabled={!isValid || isSubmitting || (serverMessage?.success && !isLoading)}
                                        className={`btn ${styles['btn-post']}`}>
                                        <i className="fa-solid fa-comment-medical"></i> Post</button>
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