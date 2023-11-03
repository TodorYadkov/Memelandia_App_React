import NoContentMessage from '../../../shared/no-content/NoContentMessage';
import styles from './Register.module.css';

export default function Register() {
    return (
        <section className={styles['register']} >
            <div className={styles['register-left']}>
                {/* <!-- If no content show this --> */}
                <NoContentMessage />
                {/* <!-- Load Top rated meme here --> */}
                < img src="/assets/test-top-rated.jpg" alt="Top rated meme" />
            </div >
            <div className={styles['register-right']}>
                <h1>Register</h1>
                {/* <!-- Use class valid and invalid when validate form --> */}
                <form action="#" method="post" className={styles['form']}>
                    <div className={styles['control-username']}>
                        <label htmlFor="username" className={`${styles['label']} ${styles['username']}`}>Username</label>
                        <input type="text" id="username" className={`${styles['input']} ${styles['valid']} ${styles['username']}`} placeholder="Username" />
                    </div>
                    <div className={styles['control-email']}>
                        <label htmlFor="email" className={`${styles['label']} ${styles['email']}`}>Email</label>
                        <input type="email" id="email" className={`${styles['input']} ${styles['invalid']} ${styles['email']}`} placeholder="Email" />
                    </div>
                    <div className={styles['control-name']}>
                        <label htmlFor="name" className={`${styles['label']} ${styles['name']}`}>Name</label>
                        <input type="name" id="name" className={`${styles['input']} ${styles['name']}`} placeholder="Name" />
                    </div>
                    <div className={styles['control-age']}>
                        <label htmlFor="age" className={`${styles['label']} ${styles['age']}`}>Age</label>
                        <input type="age" id="age" className={`${styles['input']} ${styles['age']}`} placeholder="Age" />
                    </div>
                    <div className={styles['control-password']}>
                        <label htmlFor="password" className={`${styles['label']} ${styles['password']}`}>Password</label>
                        <input type="password" id="password" className={`${styles['input']} ${styles['password']}`} placeholder="Password" />
                    </div>
                    <div className={styles['control-rePass']}>
                        <label htmlFor="rePass" className={`${styles['label']} ${styles['rePass']}`}>Confirm Password</label>
                        <input type="password" id="rePass" className={`${styles['input']} ${styles['rePass']}`} placeholder="Confirm Password" />
                    </div>
                    <div className={styles['form-buttons']}>
                        <a href="#" className={`${styles['btn']} ${styles['btn-register']}`}>REGISTER</a>
                        <a href="#" className={`${styles['btn']} ${styles['btn-link']}`}>I already have an account</a>
                    </div>
                </form>
            </div>
        </section >
    );
}