import styles from './Login.module.css';
import ForgotPasswordModal from "../forgot-password/ForgotPasswordModal";
import NoContentMessage from '../../../shared/no-content/NoContentMessage';

export default function Login() {
    return (
        <section className={styles['login']}>
            <div className={styles['login-left']}>
                {/* <!-- If no content show this --> */}
                <NoContentMessage />
                {/* <!-- Load Top rated meme here --> */}
                < img src="/assets/test-top-rated.jpg" alt="Top rated meme" />
            </div >
            <div className={styles['login-right']}>
                <h1>Sign In</h1>
                {/* <!-- Use class valid and invalid when validate form --> */}
                <form action="#" method="post" className={styles['form']}>
                    <div className={styles['control-username']}>
                        <label htmlFor="username" className={`${styles['label']} ${styles['username']}`}>Username</label>
                        <input type="text" id="username" className={`${styles['input']} ${styles['valid']} ${styles['username']}`} placeholder="Username" />
                    </div>
                    <div className={styles['control-password']}>
                        <label htmlFor="password" className={`${styles['label']} ${styles['password']}`}>Password</label>
                        <input type="password" id="password" className={`${styles['input']} ${styles['invalid']} ${styles['password']}`} placeholder="Password" />
                    </div>
                    <div className={styles['form-buttons']}>
                        <a href="#" className={`${styles['btn']} ${styles['btn-login']}`}>Log In</a>
                        <label htmlFor="modal-toggle-forgot-password" className={`${styles['btn']} ${styles['btn-link']} ${styles['modal-button']}`}>Forgot password?</label>
                        <a href="#" className={`${styles['btn']} ${styles['btn-link']}`}>Don&apos;t have an account yet?</a>
                    </div>
                </form>
            </div>

            <ForgotPasswordModal />
        </section >
    );
}