/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from './Message.module.css';

export default function Message({ type, message }) {                                                    // Possible type: simple, success, error, warning
    const [isShowMessage, setIsShowMessage] = useState(true);                                           // Set state of the message

    const closeHandler = () => {                                                                         // Hide message
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