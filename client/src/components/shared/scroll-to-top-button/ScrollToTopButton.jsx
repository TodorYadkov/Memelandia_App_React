import { useState, useEffect } from 'react';

import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {                                                                    // Check if the user has scrolled enough to show the button
            setIsVisible(window.scrollY > 500);                                                         // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
        };

        window.addEventListener('scroll', handleScroll);                                                // Add a scroll event listener

        return () => {                                                                                  // Remove the event listener on component unmount
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    const scrollToTop = () => {
        window.scrollTo({                                                                               // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`${styles['scroll-to-top-button']} ${isVisible ? styles['visible'] : styles['hidden']} `}
        >
            <i className="btn fa-solid fa-circle-chevron-up"></i>
        </button>
    );
};

export default ScrollToTopButton;