import styles from './ListMemes.module.css';
import CardMeme from "../card-meme/CardMeme";
import NoContentMessage from '../../../shared/no-content/NoContentMessage';

export default function ListMemes() {
    return (
        <section className={`${styles['catalog']} max-width`}>
            <div className={styles['catalog-search']}>
                {/* <!-- Search --> */}
                <div className={styles['search-name']}>
                    {/* <!-- Can use valid and invalid class --> */}
                    <input type="text" placeholder="Search by Name" />
                </div>
                {/* <!-- Filter by category --> */}
                <div className={styles['search-category']}>
                    {/* <!-- Dynamically Generate --> */}
                    <select>
                        <option defaultValue="test">All memes</option>
                        <option defaultValue="Dynamically Generate">Dynamically Generate</option>
                    </select>
                </div>
            </div>
            <div className={styles['all-memes']}>
                {/* <!-- If no content show this --> */}
                <NoContentMessage />
                <CardMeme />
            </div >
        </section >);
}