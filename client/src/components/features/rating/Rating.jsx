import styles from './Rating.module.css';

export default function Rating() {
    return (
        <div className={styles['rating']}>
            <span className={`${styles['rating-star']} ${styles['active']}`} data-rating="1"></span>
            <span className={styles['rating-star']} data-rating="2"></span>
            <span className={styles['rating-star']} data-rating="3"></span>
            <span className={styles['rating-star']} data-rating="4"></span>
            <span className={styles['rating-star']} data-rating="5"></span>
        </div>
    );
}