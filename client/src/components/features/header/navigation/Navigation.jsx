import styles from './Navigation.module.css';

export default function Navigation() {
    return (
        <>
            <input type="checkbox" className={styles['nav-toggle']} id="nav-toggle" />
            <nav className={styles['main-nav']}>
                <ul role="list">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Memeboard</a></li>
                    {/* <!-- Not Logged --> */}
                    <li><a href="#">Login</a></li>
                    <li><a href="#">Register</a></li>
                    <li><a href="#">About</a></li>
                    {/* <!-- Logged --> */}
                    <li><a href="#">Create Meme</a></li>
                    <li><a href="#">My Profile</a></li>
                    <li><a href="#">Logout</a></li>
                </ul>
            </nav>

            {/* <!-- Show on small screen --> */}
            <label className={styles['label']} htmlFor="nav-toggle">
                <span className={styles['nav-toggle-open']}><i className="fa-solid fa-bars"></i></span>
                <span className={styles['nav-toggle-close']}><i className="fa-solid fa-xmark"></i></span>
            </label>
        </>
    );
}