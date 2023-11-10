/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import styles from './ForgotPasswordModal.module.css';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { USER_FIELD } from '../userFieldConstants';
import { useApi } from '../../../core/hooks/useApi';
import { endpoint } from '../../../core/environments/constants';
import { trimInputData } from '../../../utils/trimInputData';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';

export default function ForgotPasswordModal({ modalHandler }) {
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '', success: '' }); // Use to display various messages from the server
    const [isPasswordVisibleModal, setPasswordVisibleModal] = useState(false); // Show hidden password in password input field
    const [isValidUser, setIsValidUser] = useState(false); // Enable - disables the password input field
    const [isActiveInputUsername, setActiveInputUsername] = useState(true); // Switch which login to use user email or username

    const api = useApi();
    const navigate = useNavigate();
    const { addUserSession } = useAuthContext();

    // React-hook-form
    const { register, handleSubmit, watch, reset, formState: { errors, isValid, touchedFields, isSubmitting } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            [USER_FIELD.username]: '',
            [USER_FIELD.email]: '',
            [USER_FIELD.securityQuestion]: '',
            [USER_FIELD.password]: '',
        }
    });
    // Use react-hook-form to monitor all required server validation values before submitting the entire form
    const watchFields = watch([USER_FIELD.username, USER_FIELD.email, USER_FIELD.securityQuestion]);

    // Validate username or email before submitting entire form --> (onBlur)
    const serverUserValidation = (e) => {
        // Get values in object
        const fieldToValidate = {
            [USER_FIELD.username]: watchFields[0],
            [USER_FIELD.email]: watchFields[1],
            [USER_FIELD.securityQuestion]: watchFields[2]
        };

        // Create object with state of each values is valid or not
        const isValid = {
            [USER_FIELD.username]: false,
            [USER_FIELD.email]: false,
            [USER_FIELD.securityQuestion]: false
        };

        // Validate user input - trim and check for empty field
        const verifiedInput = Object.entries(fieldToValidate).reduce((acc, inputField) => {
            const [inputFieldName, inputFieldValue] = inputField;

            // Validate user input
            if (inputFieldValue === '') {
                return acc;

            } else if ((inputFieldName === USER_FIELD.securityQuestion) && (inputFieldValue.length >= 6 && inputFieldValue.length <= 50)) {
                isValid[USER_FIELD.securityQuestion] = true;

            } else if ((inputFieldName === USER_FIELD.username) && (inputFieldValue.length >= 2 && inputFieldValue.length <= 15)) {
                isValid[USER_FIELD.username] = true;

            } else if ((inputFieldName === USER_FIELD.email) && /^[\w.-]+@[\w.-]+\.[\w]{2,}$/.test(inputFieldValue)) {
                isValid[USER_FIELD.email] = true;
            }

            return { ...acc, [inputFieldName]: typeof inputFieldValue === 'string' ? inputFieldValue.trim() : inputFieldValue };

        }, {});

        // Check if only one field is filled (email or username)
        // This is necessary if the interface for some reason accepts both inputs
        if (isValid[USER_FIELD.username] && isValid[USER_FIELD.email]) {
            isValid[USER_FIELD.username] = false;
            delete verifiedInput[USER_FIELD.username];
        }

        // Send a request to the server if the input is correct
        if (isValid[USER_FIELD.securityQuestion] && (isValid[USER_FIELD.username] || isValid[USER_FIELD.email])) {

            setIsLoading(true);
            api.put(endpoint.forgottenPass, verifiedInput)
                .then(response => {
                    // Check that the current user exists and the security question is correct
                    if (response?.canChangePassword) {
                        setServerMessage({ success: response.message });
                        setIsValidUser(true); // Enable password field
                    }
                })
                .catch(error => {
                    setServerMessage({ error: error.message });
                    setIsValidUser(false); // Disable password field
                })
                .finally(() => setIsLoading(false));
        }
    };

    // Submit form
    const submitHandler = (userInput) => {
        // Trim user input and check for empty field
        const trimmedInput = trimInputData(userInput);

        setIsLoading(true);
        api.put(endpoint.forgottenPass, trimmedInput)
            .then(userData => {
                // Create new session in local storage
                addUserSession(userData);
                // Reset form after submit
                reset();
                // Redirect to catalog (memeboard) - replace with new address in history
                navigate('/memes/catalog', { replace: true });
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    // Show hide password
    const toggleViewPassword = (e) => {
        // Check which field is clicked
        if (e.target.classList.contains(styles['icon-password-modal'])) {
            // Show hide password
            setPasswordVisibleModal(!isPasswordVisibleModal);
            document.getElementById('password-modal').type = isPasswordVisibleModal ? 'password' : 'text';
        }
    };

    // Select how to log with username or email
    const changeUserInput = (e) => {
        // Check which field is clicked
        if (e.target.classList.contains(styles['switch-login'])) {
            // Show or hide field
            setActiveInputUsername(!isActiveInputUsername);
        }
    };



    return (
        <div className="modal">
            <div className="modal-wrapper">
                <div className="modal-header">
                    <h4><i className="fa-solid fa-lock"></i> Change Password</h4>
                    <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                </div>
                <div className="modal-content">
                    {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
                    {(serverMessage?.success && !isLoading) && <Message type="success" message={serverMessage.success} />}

                    <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form']}>
                        {
                            isActiveInputUsername
                                ?
                                <div className={`${styles['control']} ${styles['username']} ${isActiveInputUsername ? '' : styles['exchanged']}`} onClick={changeUserInput}>
                                    <label htmlFor="username-modal" className={`${styles['label']}`}>Username</label>
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
                                        id="username-modal"
                                        className={`${styles['input']} ${(touchedFields?.username && isValid) ? styles['valid'] : errors?.username ? styles['invalid'] : ''}`}
                                        placeholder="Username"
                                        name={USER_FIELD.username}
                                        required
                                        minLength={2}
                                        maxLength={15}
                                    />
                                    <i className="fa-solid fa-circle-user"></i>
                                    <i className={`fa-solid fa-rotate ${styles['switch-login']} ${isActiveInputUsername ? '' : styles['exchanged']}`}></i>
                                    {errors?.username && (<p className={styles['error-message']}><span>{errors.username.message}</span></p>)}
                                </div>
                                :
                                <div className={`${styles['control']} ${styles['email']} ${isActiveInputUsername ? styles['exchanged'] : ''}`} onClick={changeUserInput}>
                                    <label htmlFor="email-modal" className={`${styles['label']}`}>Email</label>
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
                                        id="email-modal"
                                        className={`${styles['input']} ${(touchedFields?.email && isValid) ? styles['valid'] : errors?.email ? styles['invalid'] : ''}`}
                                        placeholder="Email"
                                        name={USER_FIELD.email}
                                        required
                                    />
                                    <i className="fa-solid fa-envelope"></i>
                                    <i className={`fa-solid fa-rotate ${styles['switch-login']} ${isActiveInputUsername ? styles['exchanged'] : ''}`}></i>
                                    {errors?.email && (<p className={styles['error-message']}><span>{errors.email.message}</span></p>)}
                                </div>
                        }
                        {/* Security Question */}
                        <div className={`${styles['control']}`}>
                            <label htmlFor="security-question-modal" className={`${styles['label']}`}>Security Question</label>
                            <input
                                {...register(USER_FIELD.securityQuestion, {
                                    required: {
                                        value: true,
                                        message: 'Security question is required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Security question must be at least six characters long'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Security question must not exceed fifty characters'
                                    }
                                })}
                                type="text"
                                id="security-question-modal"
                                className={`${styles['input']} ${(touchedFields?.securityQuestion && isValid) ? styles['valid'] : errors?.securityQuestion ? styles['invalid'] : ''}`}
                                placeholder="Security Question"
                                name={USER_FIELD.securityQuestion}
                                onBlur={serverUserValidation}
                                required
                                minLength={6}
                                maxLength={50}
                            />
                            <i className="fa-solid fa-user-shield"></i>
                            {errors?.securityQuestion && (<p className={styles['error-message']}><span>{errors.securityQuestion.message}</span></p>)}
                        </div>
                        {/* Password */}
                        <div className={`${styles['control']}`} onClick={toggleViewPassword}>
                            <label htmlFor="password-modal" className={`${styles['label']}`}>Password</label>
                            <input
                                {...register(USER_FIELD.password, {
                                    required: {
                                        value: true,
                                        message: 'Password is required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least six characters long'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Password must not exceed twenty characters'
                                    }
                                })}
                                type="password"
                                id="password-modal"
                                className={`${styles['input']} ${(touchedFields?.password && isValid) ? styles['valid'] : errors?.password ? styles['invalid'] : ''}`}
                                placeholder="Password"
                                disabled={!isValidUser}
                                required
                                minLength={6}
                                maxLength={20}
                            />
                            <i className={`fa-solid fa-eye ${styles['icon-password-modal']} ${isPasswordVisibleModal ? '' : styles['active-modal']}`}></i>
                            <i className={`fa-solid fa-eye-slash ${styles['icon-password-modal']} ${isPasswordVisibleModal ? styles['active-modal'] : ''}`}></i>
                            <i className="fa-solid fa-shield"></i>
                            {errors?.password && (<p className={styles['error-message']}><span>{errors.password.message}</span></p>)}
                        </div>
                        {/* Buttons */}
                        <div className={styles['form-buttons']}>
                            {isLoading
                                ? <Loading width="50px" height="50px" />
                                : <input
                                    type="submit"
                                    value="Change Password"
                                    disabled={!isValid || isSubmitting}
                                    className={`${styles['btn']} ${styles['btn-change-password']}`}
                                />
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