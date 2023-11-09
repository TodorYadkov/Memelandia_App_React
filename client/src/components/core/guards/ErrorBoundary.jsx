/* eslint-disable react/prop-types */
import React from 'react';

// This is the official React ErrorBoundary
// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // console.log('React info for crash: ', info); // Can be used for logging errors
        console.error('React ErrorBoundary message: ', error);
    }

    render() {
        if (this.state.hasError) {

            return (
                <div className='max-width'>
                    <h2>Oops! Page Not Be Found</h2>
                    <p>Sorry, something went wrong.</p>
                    <a href="/">Back to homepage</a>
                </div>
            );
        }

        return this.props.children;
    }
}