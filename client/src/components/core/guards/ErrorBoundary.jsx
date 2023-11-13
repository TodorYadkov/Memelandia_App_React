/* eslint-disable react/prop-types */
import React from 'react';

import styles from './ErrorBoundary.module.css';

// This is the official React ErrorBoundary
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
                            
        return { hasError: true };                                                                      // Update state so the next render will show the fallback UI.
    }

    componentDidCatch(error, info) {
        console.log('React info for crash: ', info);                                                    // Can be used for logging errors
        console.error('React ErrorBoundary message: ', error);
    }

    render() {
        if (this.state.hasError) {

            return (
                <div className={`${styles['not-found']} max-width`}>
                    <h2>Oops! An unexpected type error occurred!</h2>
                    <p>Please try again later or contact support.</p>
                    <a href="/" className={`btn ${styles['btn']} ${styles['not-found-btn']}`}><i className="fa-solid fa-face-sad-cry"></i> Back to homepage</a>
                </div>
            );
        }

        return this.props.children;
    }
}