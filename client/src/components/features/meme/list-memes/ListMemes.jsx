import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './ListMemes.module.css';
import { endpoint } from '../../../core/environments/constants';
import { MEME_CATEGORY, MEME_FIELD } from '../memeFieldConstants';

import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';

export default function ListMemes() {
    const [endpointMemes, setEndpointMemes] = useState(endpoint.getMemeBySearch('', ''));   // Use to get all memes with no search criteria

    // Use react-hook-form https://react-hook-form.com/docs/useform/register
    const { register, handleSubmit, reset, formState: { errors, isValid, touchedFields } } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: {
            [MEME_FIELD.name]: '',
            [MEME_FIELD.category]: '',
        }
    });

    useEffect(() => {
        // Add page title
        document.title = 'Memeboard';
    }, []);

    // Get data from the search form
    const submitHandler = (searchCriteria) => {
        // Trim user input
        const memeName = searchCriteria.name.trim();
        const category = searchCriteria.category;
        // Adding user input to the search query
        setEndpointMemes(endpoint.getMemeBySearch(memeName, category));
    };

    // Reset search form
    const resetForm = () => {
        // Reset from react-hook-library
        reset();
        // Get all memes from the server with an empty query string
        setEndpointMemes(endpoint.getMemeBySearch('', ''));
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