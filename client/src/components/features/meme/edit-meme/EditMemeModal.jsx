/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './EditMemeModal.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { trimInputData } from '../../../utils/trimInputData';
import { endpoint } from '../../../core/environments/constants';
import { MEME_CATEGORY, MEME_FIELD } from '../memeFieldConstants';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function EditMemeModal({ modalHandler, memeDetails, setMemeDetails }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                     // Use to display various messages from the server

    const api = useApi();

    // Use react-hook-form https://react-hook-form.com/docs/useform/register
    const { register, handleSubmit, formState: { errors, isValid, touchedFields, isSubmitting, isSubmitted } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            [MEME_FIELD.name]: memeDetails.name,                                                        // Get an initial value for the current meme
            [MEME_FIELD.category]: memeDetails.category                                                 // Get an initial value for the current meme
        }
    });

    const submitHandler = (userInput) => {                                                              // Update meme
        const trimmedInput = trimInputData(userInput);                                                  // Trim user input

        setIsLoading(true);
        api.put(endpoint.updateMeme(memeDetails._id), trimmedInput)
            .then(updatedMeme => {
                setMemeDetails(state => ({ ...state, ...updatedMeme }));                                // Update meme in state
                setServerMessage({ success: 'Meme updated successfully! 👌' });                         // Display a success message to the user
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="modal">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <h4><i className="fa-solid fa-pen-to-square"></i> Edit meme</h4>
                    <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                </div>
                <div className="modal-content">
                    {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                    {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}

                    <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form']}>
                        <div className="control-meme">
                            <label htmlFor="name" className={styles['input-label']}><i className="fa-solid fa-signature"></i> Name</label>
                            <input
                                {...register(MEME_FIELD.name, {
                                    required: {
                                        value: true,
                                        message: 'Meme name is required'
                                    },
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least two characters long'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Name must not exceed fifty characters'
                                    }
                                })}

                                id="name"
                                name={MEME_FIELD.name}
                                type="text"
                                disabled={isSubmitted}
                                required
                                minLength={2}
                                maxLength={50}
                                className={`
                                    ${styles['input']} 
                                        ${(touchedFields?.name && isValid)
                                        ? styles['valid']
                                        : errors?.name ? styles['invalid'] : ''}
                                `}
                            />
                            {errors?.name && (<p className={styles['error-message']}><span>{errors.name.message}</span></p>)}
                        </div>

                        <div className="control-meme">
                            <label htmlFor="category" className={styles['input-label']}><i className="fa-brands fa-mendeley"></i> Category</label>
                            <select
                                {...register(MEME_FIELD.category,
                                    {
                                        validate: value => MEME_CATEGORY.includes(value) || 'Value is not supported'
                                    })
                                }
                                id="category"
                                className={styles['input']}
                            >
                                <option value="">Select Category</option>
                                {MEME_CATEGORY.map(categoryName => <option key={categoryName} value={categoryName}>{categoryName}</option>)}
                            </select>

                            {errors?.category && (<p className={styles['error-message']}><span>{errors.category.message}</span></p>)}
                        </div>

                        <div className={styles['form-buttons']}>

                            {isLoading
                                ? <Loading width="50px" height="50px" />
                                : <button
                                    disabled={!isValid || isSubmitting || (serverMessage?.success && !isLoading)}
                                    className={`btn ${styles['btn-edit']}`}>
                                    <i className="fa-solid fa-pencil"></i> Edit</button>
                            }

                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>

                </div>
            </div>
        </div>
    );
}