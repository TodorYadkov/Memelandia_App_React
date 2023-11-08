/* eslint-disable jsx-a11y/no-redundant-roles */
import { NavLink } from 'react-router-dom';

import styles from './Navigation.module.css';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

export default function Navigation() {
    const { isLoggedIn } = useAuthContext();

    return (
        <>
            <input type="checkbox" className={styles['nav-toggle']} id="nav-toggle" />
            <nav className={styles['main-nav']}>
                <ul role="list">
                    <li><NavLink to="/" className={({ isActive }) => isActive ? styles['active'] : ''}>Home</NavLink></li>
                    <li><NavLink to="/memes/catalog" className={({ isActive }) => isActive ? styles['active'] : ''}>Memeboard</NavLink></li>
                    {
                        isLoggedIn
                            ?
                            <>
                                <li><NavLink to="/memes/create" className={({ isActive }) => isActive ? styles['active'] : ''}>Create Meme</NavLink></li>
                                <li><NavLink to="/profile" className={({ isActive }) => isActive ? styles['active'] : ''}>My Profile</NavLink></li>
                                <li><NavLink to="/logout" className={({ isActive }) => isActive ? styles['active'] : ''}>Logout</NavLink></li>
                            </>
                            :
                            <>
                                <li><NavLink to="/login" className={({ isActive }) => isActive ? styles['active'] : ''}>Login</NavLink></li>
                                <li><NavLink to="/register" className={({ isActive }) => isActive ? styles['active'] : ''}>Register</NavLink></li>
                                <li><NavLink to="/about" className={({ isActive }) => isActive ? styles['active'] : ''}>About</NavLink></li>
                            </>
                    }
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