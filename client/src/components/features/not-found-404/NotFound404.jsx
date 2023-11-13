import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './NotFound404.module.css';
import { scrollToTop } from '../../utils/scrollToTop';

export default function NotFound404() {
    useEffect(() => {
        document.title = 'Not-found 404';                                                               // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page
        
    }, []);

    return (
        <div className={`${styles['not-found']} max-width`}>
            <div className={styles['not-found-404']}>
                <h1 className={styles['not-found-heading']}>
                    <span>4</span>
                    <span className={styles['not-found-emoji']}>
                        <img src="/assets/emoji-crying.png" alt="Emoji crying" />
                    </span>
                    <span>4</span>
                </h1>
            </div>
            <h2>Oops! Page Not Be Found</h2>
            <p>Sorry, but the page you are looking for does not exist, has been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" replace className={`btn ${styles['btn']} ${styles['not-found-btn']}`}><i className="fa-solid fa-face-sad-cry"></i> Back to homepage</Link>
        </div>
    );
} 