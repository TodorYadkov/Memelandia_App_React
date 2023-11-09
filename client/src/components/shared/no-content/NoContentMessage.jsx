import { Link } from 'react-router-dom';

import styles from './NoContentMessage.module.css';

export default function NoContentMessage() {
    return (
        <h3 className={styles['no-content']}>Add your first Meme now from<Link to="/memes/create"> here <i className="fa-regular fa-face-grin"></i></Link></h3>
    );
}