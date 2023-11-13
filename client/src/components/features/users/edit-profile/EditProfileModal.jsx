/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './EditProfileModal.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { USER_FIELD } from '../userFieldConstants';
import { trimInputData } from '../../../utils/trimInputData';
import { endpoint } from '../../../core/environments/constants';

import Message from '../../../shared/messages/Message';
import Loading from '../../../shared/loader/Loading';


export default function EditProfileModal({ userDetails, setUserDetails, modalHandler }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' });                     // Use to display various messages from the server

    const api = useApi();
    const { addUserSession, getUserToken } = useAuthContext();

    // Use react-hook-form https://react-hook-form.com/docs/useform/register
    const { register, handleSubmit, formState: { errors, isValid, touchedFields, isSubmitting } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            [USER_FIELD.username]: userDetails[USER_FIELD.username],
            [USER_FIELD.email]: userDetails[USER_FIELD.email],
            [USER_FIELD.name]: userDetails[USER_FIELD.name],
            [USER_FIELD.age]: userDetails[USER_FIELD.age],
        }
    });

    const submitHandler = (userData) => {                                                               // On edit
        const trimmedInput = trimInputData(userData);                                                   // Trim user input

        setIsLoading(true);
        api.put(endpoint.updateUser, trimmedInput)
            .then(updatedData => {
                setServerMessage({ success: 'Information changed successfully.' });
                setUserDetails(updatedData);
                addUserSession({                                                                        // Set the update data for the entire application to be current
                    accessToken: getUserToken,
                    userDetails: { ...updatedData }
                });
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="comment-modal">
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-user-pen"></i> Edit Profile</h4>
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                    </div>
                    <div className="modal-content">
                        {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                        {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}
                        <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form']}>
                            {/* Username */}
                            <div className={`${styles['control']}`}>
                                <label htmlFor={USER_FIELD.username} className={`${styles['label']}`}>Username</label>
                                <input
                                    {...register(USER_FIELD.username, {
                                        required: {
                                            value: true,
                                            message: 'Username is required'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'Username must be at least two characters long'
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: 'Username must not exceed fifteen characters'
                                        }
                                    })}
                                    type="text"
                                    id={USER_FIELD.username}
                                    className={`${styles['input']} ${(touchedFields?.username && isValid) ? styles['valid'] : errors?.username ? styles['invalid'] : ''}`}
                                    placeholder="Username"
                                    required
                                    minLength={2}
                                    maxLength={15}
                                />
                                <i className="fa-solid fa-circle-user"></i>
                                {errors?.username && (<p className={styles['error-message']}><span>{errors.username.message}</span></p>)}
                            </div>
                            {/* Email */}
                            <div className={`${styles['control']}`}>
                                <label htmlFor={USER_FIELD.email} className={`${styles['label']}`}>Email</label>
                                <input
                                    {...register(USER_FIELD.email, {
                                        required: {
                                            value: true,
                                            message: 'Email is required'
                                        },
                                        pattern: {
                                            value: /^[\w.-]+@[\w.-]+\.[\w]{2,}$/,
                                            message: 'Invalid email address'
                                        },
                                    })}
                                    type="email"
                                    id={USER_FIELD.email}
                                    className={`${styles['input']} ${(touchedFields?.email && isValid) ? styles['valid'] : errors?.email ? styles['invalid'] : ''}`}
                                    placeholder="Email"
                                    required
                                />
                                <i className="fa-solid fa-envelope"></i>
                                {errors?.email && (<p className={styles['error-message']}><span>{errors.email.message}</span></p>)}
                            </div>
                            {/* Name */}
                            <div className={`${styles['control']}`}>
                                <label htmlFor={USER_FIELD.name} className={`${styles['label']}`}>Name</label>
                                <input
                                    {...register(USER_FIELD.name, {
                                        required: {
                                            value: true,
                                            message: 'Name is required'
                                        },
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least two characters long'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'Name must not exceed thirty characters'
                                        }
                                    })}
                                    type="name"
                                    id={USER_FIELD.name}
                                    className={`${styles['input']} ${(touchedFields?.name && isValid) ? styles['valid'] : errors?.name ? styles['invalid'] : ''}`}
                                    placeholder="Name"
                                    required
                                    minLength={2}
                                    maxLength={30}
                                />
                                <i className="fa-solid fa-user"></i>
                                {errors?.name && (<p className={styles['error-message']}><span>{errors.name.message}</span></p>)}
                            </div>
                            {/* Age */}
                            <div className={`${styles['control']} ${styles['age']}`}>
                                <label htmlFor={USER_FIELD.age} className={`${styles['label']}`}>Age</label>
                                <input
                                    {...register(USER_FIELD.age, {
                                        valueAsNumber: true,
                                        required: {
                                            value: true,
                                            message: 'Age is required'
                                        },
                                        min: {
                                            value: 12,
                                            message: 'Age must be at least 12 years old'
                                        },
                                        max: {
                                            value: 120,
                                            message: 'Age must not exceed 120 years old'
                                        }
                                    })}
                                    type="number"
                                    id={USER_FIELD.age}
                                    className={`${styles['input']} ${(touchedFields?.age && isValid) ? styles['valid'] : errors?.age ? styles['invalid'] : ''}`}
                                    placeholder="Age"
                                    step={1}
                                    required
                                    min={12}
                                    max={120}
                                />
                                <i className="fa-solid fa-id-card"></i>
                                {errors?.age && (<p className={styles['error-message']}><span>{errors.age.message}</span></p>)}
                            </div>
                            {/* Buttons */}
                            <div className={styles['form-buttons']}>
                                {isLoading
                                    ? <Loading width="50px" height="50px" />
                                    : <button disabled={!isValid || isSubmitting || (serverMessage?.success && !isLoading)} className={`btn ${styles['btn']} ${styles['btn-edit-profile']}`}><i className="fa-solid fa-user-pen"></i> Edit</button>
                                }
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>
                    </div>
                </div>
            </div>
        </div >
    );
}