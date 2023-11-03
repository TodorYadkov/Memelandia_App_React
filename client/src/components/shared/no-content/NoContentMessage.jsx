import styles from './NoContentMessage.module.css';

export default function NoContentMessage() {
    return (
        <h3 className={styles['no-content']}>Add your first Meme now from<a href="#"> here <i className="fa-regular fa-face-grin"></i></a></h3>
    );
}