import styles from './ForgotPasswordModal.module.css';

export default function ForgotPasswordModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-forgot-password" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-lock"></i> Change Password</h4>
                        <label htmlFor="modal-toggle-forgot-password" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        <form action="#" method="post" className={styles['form']}>
                            {/* <!-- Hide in begin --> */}
                            <div className={styles['control-username']}>
                                <label htmlFor="username" className={`${styles['label']} ${styles['username']}`}>Username</label>
                                <input type="text" id="username" className={`${styles['input']} ${styles['valid']} ${styles['username']}`} placeholder="Username" />
                            </div>
                            {/* <!-- Hide before check --> */}
                            <div className={styles['control-password']}>
                                <label htmlFor="password" className={`${styles['label']} ${styles['password']}`}>Password</label>
                                <input type="password" id="password" className={`${styles['input']} ${styles['invalid']} ${styles['password']}`} placeholder="Password" />
                            </div>
                            <div className={styles['form-buttons']}>
                                <a href="#" className={`${styles['btn']} ${styles['btn-login']}`}>Check User/Change Password</a>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-forgot-password" className="modal-close"><i className="fa-solid fa-xmark"></i> Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}