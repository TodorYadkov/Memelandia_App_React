import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import styles from './Register.module.css';
import { USER_FIELD } from '../userFieldConstants';
import { useApi } from '../../../core/hooks/useApi';
import { useAuthContext } from '../../../core/hooks/useAuthContext';
import { endpoint } from '../../../core/environments/constants';

import Message from '../../../shared/messages/Message';
import Loading from '../../../shared/loader/Loading';

export default function Register() {
    const [currentTopMeme, setCurrentTopMeme] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isRePasswordVisible, setRePasswordVisible] = useState(false);
    const { addUserSession } = useAuthContext();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, reset, formState: { errors, isValid, touchedFields, isSubmitting } } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            [USER_FIELD.username]: '',
            [USER_FIELD.email]: '',
            [USER_FIELD.name]: '',
            [USER_FIELD.age]: '',
            [USER_FIELD.password]: '',
            [USER_FIELD.securityQuestion]: '',
        }
    });

    const api = useApi();
    useEffect(() => {
        // Get second meme to display in the registration form
        setIsLoading(true);
        api.get(endpoint.getTopRatedMemes)
            .then(topThreeMemes => topThreeMemes.length > 1 && setCurrentTopMeme(topThreeMemes[1]))
            .catch(error => setErrorMessage(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Submit form
    const submitHandler = (userInput) => {
        // Trim user input
        const trimmedInput = Object.entries(userInput).reduce((acc, inputField) => {
            const [inputFieldName, inputFieldValue] = inputField;
            return { ...acc, [inputFieldName]: typeof inputFieldValue === 'string' ? inputFieldValue.trim() : inputFieldValue };
        }, {});
        // Exclude rePass field 
        const { rePass, ...verifiedUserData } = trimmedInput;

        setIsLoading(true);
        api.post(endpoint.register, verifiedUserData)
            .then(userData => {
                // Create new session in local storage
                addUserSession(userData);
                // Reset form after submit
                reset();
                // Redirect to catalog (memeboard)
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

        } else if (e.target.classList.contains(styles['icon-re-pass'])) {
            // Show hide confirm password
            setRePasswordVisible(!isRePasswordVisible);
            document.getElementById('rePass').type = isRePasswordVisible ? 'password' : 'text';
        }
    };

    return (
        <section className={styles['register']} >
            <div className={styles['register-left']}>

                {isLoading && <Loading />}
                {
                    !isLoading
                        ? currentTopMeme['imageUrl']
                            ? <img src={currentTopMeme.imageUrl} alt={currentTopMeme.name} />
                            : <p className={styles['no-meme']}>Be the first to add a Meme</p>
                        : null
                }

            </div >
            <div className={styles['register-right']}>
                {errorMessage && <Message type="error" message={errorMessage} />}
                <h1>Register</h1>

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
                    <div className={`${styles['control']}`}>
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
                    {/* Security Question */}
                    <div className={`${styles['control']}`}>
                        <label htmlFor={USER_FIELD.securityQuestion} className={`${styles['label']}`}>Security Question</label>
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
                            id={USER_FIELD.securityQuestion}
                            className={`${styles['input']} ${(touchedFields?.securityQuestion && isValid) ? styles['valid'] : errors?.securityQuestion ? styles['invalid'] : ''}`}
                            placeholder="Security Question"
                            required
                            minLength={6}
                            maxLength={50}
                        />
                        <i className="fa-solid fa-user-shield"></i>
                        {errors?.securityQuestion && (<p className={styles['error-message']}><span>{errors.securityQuestion.message}</span></p>)}
                    </div>
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
                    {/* Repeat Password */}
                    <div className={`${styles['control']} ${styles['re-pass']}`} onClick={toggleViewPassword}>
                        <label htmlFor="rePass" className={`${styles['label']} ${styles['re-pass']}`}>Confirm Password</label>
                        <input
                            {...register('rePass', {
                                required: {
                                    value: true,
                                    message: 'Confirm Password is required'
                                },
                                minLength: {
                                    value: 6,
                                    message: 'Confirm Password must be at least six characters long'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Confirm Password must not exceed twenty characters'
                                },
                                validate: (value) => {
                                    if (watch(USER_FIELD.password) !== value) {
                                        return 'Password does not match';
                                    }
                                }
                            })}
                            type="password"
                            id="rePass"
                            className={`${styles['input']} ${styles['re-pass']} ${(touchedFields?.rePass && isValid) ? styles['valid'] : errors?.rePass ? styles['invalid'] : ''}`}
                            placeholder="Confirm Password"
                            required
                            minLength={6}
                            maxLength={20}
                        />
                        <i className={`fa-solid fa-eye ${styles['icon-re-pass']} ${isRePasswordVisible ? '' : styles['active']}`}></i>
                        <i className={`fa-solid fa-eye-slash ${styles['icon-re-pass']} ${isRePasswordVisible ? styles['active'] : ''}`}></i>
                        <i className="fa-solid fa-person-military-to-person"></i>
                        {errors?.rePass && (<p className={styles['error-message']}><span>{errors.rePass.message}</span></p>)}
                    </div>
                    {/* Buttons */}
                    <div className={styles['form-buttons']}>
                        <input
                            type="submit"
                            value="REGISTER"
                            disabled={!isValid || isSubmitting}
                            className={`${styles['btn']} ${styles['btn-register']}`}
                        />
                        <Link to="/login" className={`${styles['btn']} ${styles['btn-link']}`}>I already have an account</Link>
                    </div>
                </form>
            </div>
        </section >
    );
}