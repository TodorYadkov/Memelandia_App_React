import { useEffect, useState } from 'react';
import styles from './Message.module.css';

// eslint-disable-next-line react/prop-types
export default function Message({ type, message }) {
    const [isShownMessage, setIsShowMessage] = useState(true);

    useEffect(() => {
        return () => {
            setIsShowMessage(true); // Reset the state when the component unmount
        };
    }, []);

    const closeHandler = (e) => {
        // Hide message
        setIsShowMessage(!isShownMessage);
    };

    if (type === 'simple') {
        return (
            <>
                {
                    isShownMessage && (
                        <div className={`${styles['alert']} ${styles['simple-alert']} ${styles['clear-error']}`}>
                            <h6>{message}</h6>
                            <p onClick={closeHandler} className={styles['close']}><span>&times;</span></p>
                        </div>
                    )
                }
            </>

        );

    } else if (type === 'success') {
        return (
            <>
                {
                    isShownMessage && (
                        <div className={`${styles['alert']} ${styles['success-alert']}  ${styles['clear-error']}`}>
                            <h6>{message}</h6>
                            <p onClick={closeHandler} className={styles['close']}><span>&times;</span></p>
                        </div>
                    )
                }
            </>

        );
    } else if (type === 'error') {
        return (
            <>
                {
                    isShownMessage && (
                        <div className={`${styles['alert']} ${styles['danger-alert']}  ${styles['clear-error']}`}>
                            <h6>{message}</h6>
                            <p onClick={closeHandler} className={styles['close']}><span>&times;</span></p>
                        </div>
                    )
                }
            </>

        );
    } else if (type === 'warning') {
        return (
            <>
                {
                    isShownMessage && (
                        <div className={`${styles['alert']} ${styles['warning-alert']}  ${styles['clear-error']}`}>
                            <h6>{message}</h6>
                            <p onClick={closeHandler} className={styles['close']}><span>&times;</span></p>
                        </div>
                    )
                }
            </>
        );
    }

    return null;
}