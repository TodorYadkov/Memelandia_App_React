// CreateMemeHeader.js
import styles from '../CreateMeme.module.css';

export default function CreateMemeHeader() {
    return (
        <header className={styles['section-create-header']}>
            <h1>Create your Meme</h1>
            <img src="/assets/emoji-omg.svg" alt="Emoji smile" />
        </header>
    );
}