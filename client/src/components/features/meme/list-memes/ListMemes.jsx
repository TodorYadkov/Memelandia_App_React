import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import styles from './ListMemes.module.css';
import { endpoint } from '../../../core/environments/constants';
import { MEME_CATEGORY, MEME_FIELD } from '../memeFieldConstants';
import { scrollToTop } from '../../../utils/scrollToTop';

import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';

export default function ListMemes() {
    const [searchParams, setSearchParams] = useSearchParams();                                          // Use to handle query params

    const [endpointMemes, setEndpointMemes] = useState(() => {                                          // Use to initial endpoint state to get memes with or without search query parameters
        if (searchParams.get('name') || searchParams.get('category')) {
            const memeName = searchParams.get('name') ? searchParams.get('name') : '';
            const category = searchParams.get('category') ? searchParams.get('category') : '';

            return endpoint.getMemeBySearch(memeName, category);                                        // Return endpoint with search query params
        }

        return endpoint.getAllMemes;                                                                    // Return endpoint to get all memes   
    });

    // Use react-hook-form https://react-hook-form.com/docs/useform/register
    const { register, handleSubmit, reset, formState: { errors, isValid, touchedFields }, setValue } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });

    useEffect(() => {
        document.title = 'Memeboard';                                                                   // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        if (searchParams.get('name') || searchParams.get('category')) {                                 // If the meme list is invoked with query parameters
            const query = {                                                                             // Create an object with query parameters and select the desired category
                name: searchParams.get('name') ? searchParams.get('name') : '',
                category: searchParams.get('category') ? searchParams.get('category') : ''
            };

            submitHandler(query);                                                                       // Execute query

            // Set form default values to show the user the correct values on the form
            setValue(MEME_FIELD.name, query.name);                                                      // Get from query name
            setValue(MEME_FIELD.category, query.category);                                              // Get from query category
        }

    }, [searchParams]);

    const submitHandler = (searchCriteria) => {                                                         // Get data from the search form
        const memeName = searchCriteria.name.trim();                                                    // Trim user input
        const category = searchCriteria.category;

        setEndpointMemes(endpoint.getMemeBySearch(memeName, category));                                 // Adding user input to the search query

        if (Object.values(searchCriteria).some(c => c)) {                                               // Set search params query (when the search criteria are empty string auto reset form)
            setSearchParams({ name: memeName, category });

        } else {
            setSearchParams({});                                                                        // Set no query params in the browser address bar
            setEndpointMemes(endpoint.getAllMemes);                                                     // Set new endpoint to get all memes from the server with no query string
        }
    };

    const resetForm = () => {                                                                           // Reset search form
        reset();                                                                                        // Reset from react-hook-library
        setEndpointMemes(endpoint.getAllMemes);                                                         // Get all memes from the server with an empty query string
        setSearchParams({});                                                                            // Reset address bar state
    };

    return (
        <section className={`${styles['catalog']} max-width`}>
            <form onSubmit={handleSubmit(submitHandler)} method="post" className={styles['form-search']}>
                <div className={styles['search-name']}>
                    <input
                        type="text"
                        placeholder="Search by Name"
                        {...register(MEME_FIELD.name, {
                            minLength: {
                                value: 2,
                                message: 'Name must be at least two characters long'
                            },
                            maxLength: {
                                value: 50,
                                message: 'Name must not exceed fifty characters'
                            }
                        })}
                        onBlur={handleSubmit(submitHandler)}
                        className={`${(touchedFields?.name && isValid) ? styles['valid'] : errors?.name ? styles['invalid'] : ''}`}
                        minLength={2}
                        maxLength={50}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                    {errors?.name && (<p className={styles['error-message']}><span>{errors.name.message}</span></p>)}
                </div>

                <div className={styles['search-category']}>
                    <select
                        {...register(MEME_FIELD.category)}
                        onBlur={handleSubmit(submitHandler)}
                    >
                        <option value="">Filter by category</option>
                        {MEME_CATEGORY.map(categoryName => <option key={categoryName} value={categoryName}>{categoryName}</option>)}
                    </select>
                    <i className="fa-solid fa-filter"></i>
                </div>
                <div className={styles['search-button-wrapper']}>
                    <button onClick={resetForm} type='reset' className={`btn ${styles['btn-reset']}`}><i className="fa-solid fa-broom"></i> Clear</button>
                </div>
            </form>

            <div className={styles['all-memes']}>

                {<InfiniteScrollComponent endpoint={endpointMemes} />}

            </div >
        </section >
    );
}