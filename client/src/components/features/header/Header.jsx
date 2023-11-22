import { NavLink } from 'react-router-dom';

import styles from './Header.module.css';
import Navigation from './navigation/Navigation';

export default function Header() {
    return (
        <header className={styles['site-header']}>

            <div className={styles['wave']}>

                <div className={styles['content']}>
                    <h2 className={styles['welcome-text']}>Welcome to <span>Meme</span><span>Landia</span></h2>
                    <h2 className={styles['welcome-text']}>Welcome to <span>Meme</span><span>Landia</span></h2>
                </div>

                <div className={styles['ship-wrapper']}>
                    <img className={styles['pirate-img']} src="/assets/pirate-ship.svg" alt="Header pirate ship" />
                </div>

                <div className={styles['emoji-wrapper']}>
                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-wow.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>Wow</p>
                    </div>

                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-cool.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>Cool</p>
                    </div>

                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-wtf.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>WTF</p>
                    </div>

                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-love.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>Love</p>
                    </div>

                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-lol.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>Lol</p>
                    </div>

                    <div className={styles['emoji-group']}>
                        <img className={styles['emoji']} src="/assets/emoji-omg.svg" alt="Emoji" />
                        <p className={styles['emoji-text']}>OMG</p>
                    </div>
                </div>

                <div className={styles['ocean']}>
                    <div className={styles['ocean-wave']}></div>
                    <div className={styles['ocean-wave']}></div>
                    <div className={styles['ocean-wave']}></div>
                </div>

                <img className={styles['wave-img-pink']} src="/assets/header-wave-pink.svg" alt="Header wave pink" />
                <img className={styles['wave-img']} src="/assets/header-wave-small.svg" alt="Header wave" />
            </div>

            <div className={styles['header-nav-background']}>
                <div className={`${styles['header-nav-wrapper']} container`}>
                    <h2 className={styles['site-logo']}>
                        <NavLink to="/">Meme<span>Landia</span><span>world of memes</span></NavLink>
                    </h2>

                    <Navigation />

                </div>
            </div>
        </header>
    );
}