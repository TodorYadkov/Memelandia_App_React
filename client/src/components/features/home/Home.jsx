import NoContentMessage from '../../shared/no-content/NoContentMessage';
import CardMeme from '../meme/card-meme/CardMeme';
import styles from './Home.module.css';

export default function Home() {
    return (
        <section className={`${styles['home']} max-width`}>
            <div className={styles['welcome']}>
                <h1 className={styles['welcome-text']}>Welcome to <span>Meme</span><span>Landia</span></h1>
                <div className={styles['welcome-img-wrapper']}>
                    <img className={styles['welcome-image-default']} src="/assets/pepe-the-frog.png" alt="Pepe the Frog meme" />
                    <img className={styles['welcome-image-on-hover']} src="/assets/pepe-the-frog-time.png" alt="Pepe the Frog meme" />
                </div>
            </div>
            <div className={styles['top-rated-memes']}>
                {/* <!-- If no content show this --> */}
                <NoContentMessage />
                <CardMeme />
            </div>
            {/* <!-- Jokes use external api to get jokes--> */}
            <div className={styles['jokes']}>
                <div className={styles['jokes-wrapper-heading']}>
                    <h3>Something Funny</h3>
                    <img src="/assets/emoji-smile.svg" alt="Emoji smile" />
                </div>
                <div className={styles['jokes-wrapper-text']}>
                    <p className={styles['jokes-text']}><sup><i className="fa-solid fa-quote-left"></i></sup>Some bla bla</p>
                </div>
                <p><a href="#" className={`${styles['btn']} ${styles['more']}`}><i className="fa-solid fa-angles-right"></i></a></p>
            </div>
        </section >
    );
}