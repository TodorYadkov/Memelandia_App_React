/* eslint-disable react/prop-types */
import styles from './Rating.module.css';

export default function Rating({ rating }) {

    return (
        <div className={styles['rating']}>
            <span className={`${styles['rating-star']}${rating >= 1 ? ` ${styles['active']}` : ''}`}></span>
            <span className={`${styles['rating-star']}${rating >= 2 ? ` ${styles['active']}` : ''}`}></span>
            <span className={`${styles['rating-star']}${rating >= 3 ? ` ${styles['active']}` : ''}`}></span>
            <span className={`${styles['rating-star']}${rating >= 4 ? ` ${styles['active']}` : ''}`}></span>
            <span className={`${styles['rating-star']}${rating >= 5 ? ` ${styles['active']}` : ''}`}></span>
        </div>
    );
}