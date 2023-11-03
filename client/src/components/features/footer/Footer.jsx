import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles['site-footer']}>
            <div className={`${styles['footer-content']} container`}>
                <section className={styles['columns']}>
                    <h5>Used Material</h5>
                    <ul role="list">
                        <li>Font: <a href="https://fonts.google.com/" target="_blank" rel="noreferrer nofollow">Google Fonts</a></li>
                        <li>Icons: <a href="https://fontawesome.com/" target="_blank" rel="noreferrer nofollow">Font Awesome</a></li>
                        <li>Styling: <a href="https://github.com/TodorYadkov/" target="_blank" rel="noreferrer nofollow">Todor Yadkov</a></li>
                    </ul>
                </section>

                <section className={styles['columns']}>
                    <h5>About Me</h5>
                    <ul role="list">
                        <li>LinkedIn Profile: <a href="https://www.linkedin.com/in/todor-yadkov-080150247" target="_blank" rel="noreferrer nofollow">LinkedIn</a></li>
                        <li>Project on GitHub: <a href="https://github.com/TodorYadkov/Memelandia_App_React" target="_blank" rel="noreferrer nofollow">GitHub</a></li>
                        <li>Email: <a href="mailto:todor.yadkov@gmail.com">todor.yadkov@gmail.com</a></li>
                    </ul>
                </section>

                <section className={styles['columns']}>
                    <h5>Project Information</h5>
                    <ul role="list">
                        <li>SoftUni Course - <a href="https://softuni.bg/trainings/4238/reactjs-october-2023" target="_blank" rel="noreferrer nofollow">React - October 2023</a></li>
                        <li>Final project for building a client-side application (SPA) with React. The project is
                            implemented with its own backend server built with Node.js and Express.js, MongoDB for the
                            database, CSS and HTML5 for styling.</li>
                    </ul>
                </section>
            </div>
            <div className={styles['footer-copyright']}>
                <p>© Todor Yadkov - Course Project &quot;Memelandia&quot; - 2023 - &quot;Dynamic property&quot;</p>
            </div>
        </footer >
    );
}