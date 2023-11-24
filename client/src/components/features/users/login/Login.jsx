/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import styles from './Login.module.css';
import { USER_FIELD } from '../userFieldConstants';
import { useApi } from '../../../core/hooks/useApi';
import { useModal } from '../../../core/hooks/useModal';
import { scrollToTop } from '../../../utils/scrollToTop';
import { trimInputData } from '../../../utils/trimInputData';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import ForgotPasswordModal from '../forgot-password/ForgotPasswordModal';

export default function Login() {
    const [currentTopMeme, setCurrentTopMeme] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server
    const [isPasswordVisible, setPasswordVisible] = useState(false);                                    // Show hidden password in password input field
    const [isActiveInputUsername, setActiveInputUsername] = useState(true);                             // Switch which login to use user email or username
    const [isShownModal, setIsShownModal] = useModal();                                                 // Show hide modal for forgotten password

    const api = useApi();
    const navigate = useNavigate();
    const { addUserSession } = useAuthContext();
    // Use react-hook-form https://react-hook-form.com/docs/useform/register
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
        document.title = 'Login page';                                                                  // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        setIsLoading(true);
        api.get(endpoint.getTopRatedMemes)                                                      
            .then(topThreeMemes => topThreeMemes.length > 1 && setCurrentTopMeme(topThreeMemes[0]))     // Get first meme to display in the login form
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    }, []);

    const submitHandler = (userInput) => {                                                              // Submit login form
        const trimmedInput = trimInputData(userInput);                                                  // Trim user input and check for empty field

        setIsLoading(true);
        api.post(endpoint.login, trimmedInput)
            .then(userData => {
                addUserSession(userData);                                                               // Create new session in local storage
                reset();                                                                                // Reset form after submit
                
                navigate('/memes/catalog', { replace: true });                                          // Redirect to catalog (memeboard) - replace with new address in history
            })
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    };

    const toggleViewPassword = (e) => {                                                                 // Show hide password
        if (e.target.classList.contains(styles['icon-password'])) {                                     // Check which field is clicked
            
            setPasswordVisible(!isPasswordVisible);
            document.getElementById(USER_FIELD.password).type = isPasswordVisible ? 'password' : 'text';
        }
    };

    const changeUserInput = (e) => {                                                                    // Select how to log with username or email
        if (e.target.classList.contains(styles['switch-login'])) {                                      // Check which field is clicked
            
            setActiveInputUsername(!isActiveInputUsername);                                             // Show or hide field
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
                {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}
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

                        <button onClick={setIsShownModal} type="button" className={`${styles['btn']} ${styles['btn-link']}`}>Forgot password?</button>
                        <Link to="/register" className={`${styles['btn']} ${styles['btn-link']}`}>Don&apos;t have an account yet?</Link>
                    </div>
                </form>
            </div >

            {isShownModal && <ForgotPasswordModal modalHandler={setIsShownModal} />}
        </section >
    );
}