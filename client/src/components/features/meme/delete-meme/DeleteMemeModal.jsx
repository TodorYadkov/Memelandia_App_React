/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from './DeleteMemeModal.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

export default function DeleteMemeModal({ modalHandler, memeDetails, onDeleteMeme }) {
    const [isDeleted, setIsDeleted] = useState(false);                                                  // Use to disable the delete button after deleting a meme
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();
    const { addUserSession, getUserDetails, getUserToken } = useAuthContext();

    const deleteHandler = () => {                                                                       // Delete meme
        setIsLoading(true);
        api.delete(endpoint.deleteMeme(memeDetails._id))
            .then(deletedMeme => {
                setIsDeleted(true);                                                                     // Disable delete button
                onDeleteMeme && onDeleteMeme(memeDetails._id);                                          // Custom (optional) handler when meme is delete what to happen (redirect or re-render parent component)
                addUserSession({                                                                        // addUserSession is a function that update state
                    accessToken: getUserToken,                                                          // Accepts an object with accessToken and userDetails
                    userDetails: {                                                                      // Destructuring and modify only memesCount
                        ...getUserDetails,
                        memesCount: getUserDetails.memesCount - 1                                       // Decrement user global state with one
                    }
                });
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="modal">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <h4><i className="fa-solid fa-trash"></i> Confirm delete</h4>
                    <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                </div>
                <div className="modal-content">

                    {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                    <div className={styles['delete-wrapper']}>

                        <h4 className={styles['heading-delete']}>Are you sure you want to delete this meme?</h4>
                        {isLoading
                            ? <Loading width="50px" height="50px" />
                            : <button
                                onClick={deleteHandler}
                                type='button'
                                disabled={isDeleted}
                                className={styles['btn-delete']}>
                                <i className="btn fa-solid fa-triangle-exclamation"></i> Delete</button>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>
                </div>
            </div>
        </div>
    );
}