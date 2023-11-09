/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './Message.module.css';

// Possible type: simple, success, error, warning
export default function Message({ type, message }) {
    const [isShowMessage, setIsShowMessage] = useState(true);

    const closeHandler = () => {
        // Hide message
        setIsShowMessage(false);
    };

    if (isShowMessage) {
        return (
            <div className={`${styles['alert']} ${styles[`${type}-alert`]} ${styles['clear-error']}`}>
                <h6>{message}</h6>
                <p onClick={closeHandler} className={styles['close']}><span>&times;</span></p>
            </div>
        );
    }

    return null;
}