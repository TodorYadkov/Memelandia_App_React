import styles from './Profile.module.css';
import EditProfileModal from '../edit-profile/EditProfileModal';
import CardMeme from '../../meme/card-meme/CardMeme';
import Rating from '../../rating/Rating';
import NoContentMessage from '../../../shared/no-content/NoContentMessage';

export default function Profile() {
    return (
        < section className={`${styles['profile']} max-width`}>
            <div className={styles['profile-details']}>
                <div className={styles['profile-heading']}>
                    <h1><i className="fa-solid fa-user"></i> <span>User</span> <span>Profile</span></h1>

                    <Rating />

                </div>
                <div className={styles['profile-header']}>
                    <p>
                        <span className={styles['profile-name']}>Peter Parker</span>
                        <span className={styles['profile-username']}>(username)</span>
                        <span className={styles['profile-age']}>16 years old</span>
                    </p>
                </div>
                <div className={styles['profile-stat']}>
                    <div className={styles['profile-stat-container']}>
                        <div className={styles['box']}>
                            <div className={styles['shadow']}></div>
                            <div className={styles['content']}>
                                {/* <!-- On num add needed value to calculate rotation --> */}
                                <div className={styles['percent']} data-text="Post" style={{ '--num': '5' }}>
                                    <div className={styles['dot']}></div>
                                    <svg>
                                        <circle cx="70" cy="70" r="70"></circle>
                                        <circle cx="70" cy="70" r="70"></circle>
                                    </svg>
                                </div>
                                <div className={styles['number']}>
                                    <h2>5<span>%</span></h2>
                                </div>
                            </div>
                        </div>

                        <div className={styles['box']}>
                            <div className={styles['shadow']}></div>
                            <div className={styles['content']}>
                                <div className={styles['percent']} data-text="Fav" style={{ '--num': '10' }}>
                                    <div className={styles['dot']}></div>
                                    <svg>
                                        <circle cx="70" cy="70" r="70"></circle>
                                        <circle cx="70" cy="70" r="70"></circle>
                                    </svg>
                                </div>
                                <div className={styles['number']}>
                                    <h2>10<span>%</span></h2>
                                </div>
                            </div>
                        </div>

                        <div className={styles['box']}>
                            <div className={styles['shadow']}></div>
                            <div className={styles['content']}>
                                <div className={styles['percent']} data-text="Rating" style={{ '--num': '0.1' }}>
                                    <div className={styles['dot']}></div>
                                    <svg>
                                        <circle cx="70" cy="70" r="70"></circle>
                                        <circle cx="70" cy="70" r="70"></circle>
                                    </svg>
                                </div>
                                <div className={styles['number']}>
                                    <h2>0.1<span>%</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['profile-buttons']}>
                    <label htmlFor="modal-toggle-edit-user-details" className={`${styles['btn']} ${styles['btn-user']} ${styles['modal-button']}`}><i className={`${styles['fa-solid']} ${styles['fa-user-pen']}`}></i> Edit Profile</label>
                    <a className={`${styles['btn']} ${styles['btn-user']}`}><i className="fa-solid fa-heart"></i> View Favorite</a>
                </div>
                <div className={styles['profile-footer']}>
                    <p className={styles['profile-join']}>Joined: 11.12.2019</p>
                    <p className={styles['profile-update']}>Updated: 12.20.2020</p>
                </div>
            </div>

            <div className={styles['profile-memes']}>
                <h2 className={styles['profile-memes-heading']}>My Memes</h2>
                {/* <!-- Show when is call favorite memes --> */}
                <h2 className={styles['profile-memes-heading']}>Favorite Memes</h2>
                {/* <!-- If no content show this --> */}
                <NoContentMessage />

                <CardMeme />
                
            </div >

            <EditProfileModal />
        </section >
    );
}