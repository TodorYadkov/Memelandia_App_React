/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import styles from './Login.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { endpoint } from '../../../core/environments/constants';

import { USER_FIELD } from '../userFieldConstants';
import ForgotPasswordModal from '../forgot-password/ForgotPasswordModal';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import { useModal } from '../../../core/hooks/useModal';

export default function Login() {
    const [currentTopMeme, setCurrentTopMeme] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isActiveInputUsername, setActiveInputUsername] = useState(true);
    const [isShownModal, toggleModal] = useModal();
    const { addUserSession } = useAuthContext();
    const navigate = useNavigate();
    const api = useApi();

    const { register, handleSubmit, reset, formState: { errors, isValid, touchedFields, isSubmitting } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            [USER_FIELD.username]: '',
            [USER_FIELD.email]: '',
            [USER_FIELD.password]: '',
        }
    });

    useEffect(() => {
        // Get first meme to display in the login form
        setIsLoading(true);
        api.get(endpoint.getTopRatedMemes)
            .then(topThreeMemes => topThreeMemes.length > 1 && setCurrentTopMeme(topThreeMemes[0]))
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Submit form
    const submitHandler = (userInput) => {
        // Trim user input and check for empty field
        const trimmedInput = Object.entries(userInput).reduce((acc, inputField) => {
            const [inputFieldName, inputFieldValue] = inputField;
            // Check if the email or username is empty
            if (inputFieldValue === '') {
                return acc;
            }

            return { ...acc, [inputFieldName]: typeof inputFieldValue === 'string' ? inputFieldValue.trim() : inputFieldValue };
        }, {});

        setIsLoading(true);
        api.post(endpoint.login, trimmedInput)
            .then(userData => {
                // Create new session in local storage
                addUserSession(userData);
                // Reset form after submit
                reset();
                // Redirect to catalog (memeboard) - replace with new address in history
                navigate('/catalog', { replace: true });
            })
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    };

    // Show hide password
    const toggleViewPassword = (e) => {
        // Check which field is clicked
        if (e.target.classList.contains(styles['icon-password'])) {
            // Show hide password
            setPasswordVisible(!isPasswordVisible);
            document.getElementById(USER_FIELD.password).type = isPasswordVisible ? 'password' : 'text';
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
        <section className={styles['login']}>
            <div className={styles['login-left']}>

                {isLoading && <Loading />}
                {
                    !isLoading
                        ? currentTopMeme['imageUrl']
                            ? <img src={currentTopMeme.imageUrl} alt={currentTopMeme.name} />
                            : <p className={styles['no-meme']}>Be the first to add a Meme</p>
                        : null
                }

            </div >
            <div className={styles['login-right']}>
                {errorMessage && <Message type="error" message={errorMessage} />}
                <h1>Sign In</h1>

                <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form']}>
                    {
                        isActiveInputUsername
                            ?
                            <div className={`${styles['control']} ${styles['username']} ${isActiveInputUsername ? '' : styles['exchanged']}`} onClick={changeUserInput}>
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
                                <i className={`fa-solid fa-rotate ${styles['switch-login']} ${isActiveInputUsername ? '' : styles['exchanged']}`}></i>
                                {errors?.username && (<p className={styles['error-message']}><span>{errors.username.message}</span></p>)}
                            </div>
                            :
                            <div className={`${styles['control']} ${styles['email']} ${isActiveInputUsername ? styles['exchanged'] : ''}`} onClick={changeUserInput}>
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
                                <i className={`fa-solid fa-rotate ${styles['switch-login']} ${isActiveInputUsername ? styles['exchanged'] : ''}`}></i>
                                {errors?.email && (<p className={styles['error-message']}><span>{errors.email.message}</span></p>)}
                            </div>
                    }

                    {/* Password */}
                    <div className={`${styles['control']}`} onClick={toggleViewPassword}>
                        <label htmlFor={USER_FIELD.password} className={`${styles['label']}`}>Password</label>
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
                            id={USER_FIELD.password}
                            className={`${styles['input']} ${(touchedFields?.password && isValid) ? styles['valid'] : errors?.password ? styles['invalid'] : ''}`}
                            placeholder="Password"
                            required
                            minLength={6}
                            maxLength={20}
                        />
                        <i className={`fa-solid fa-eye ${styles['icon-password']} ${isPasswordVisible ? '' : styles['active']}`}></i>
                        <i className={`fa-solid fa-eye-slash ${styles['icon-password']} ${isPasswordVisible ? styles['active'] : ''}`}></i>
                        <i className="fa-solid fa-shield"></i>
                        {errors?.password && (<p className={styles['error-message']}><span>{errors.password.message}</span></p>)}
                    </div>
                    <div className={styles['form-buttons']}>
                        <input
                            type="submit"
                            value="Log In"
                            disabled={!isValid || isSubmitting}
                            className={`${styles['btn']} ${styles['btn-login']}`}
                        />

                        <button onClick={toggleModal} type="button" className={`${styles['btn']} ${styles['btn-link']}`}>Forgot password?</button>
                        <Link to="/register" className={`${styles['btn']} ${styles['btn-link']}`}>Don&apos;t have an account yet?</Link>
                    </div>
                </form>
            </div >

            {isShownModal && <ForgotPasswordModal modalHandler={toggleModal} />}
        </section >
    );
}