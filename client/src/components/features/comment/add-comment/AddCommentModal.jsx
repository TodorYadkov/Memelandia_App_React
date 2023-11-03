import styles from './AddCommentModal.module.css';

export default function AddCommentModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-comment" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-comment-medical"></i> Add New Comment</h4>
                        <label htmlFor="modal-toggle-comment" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        <form action="#" method="post" className={styles['form']}>
                            <div className="control-comment">
                                <textarea rows="5" cols="60" name="comment" type="text" id="comment"
                                    className={`${styles['input']} ${styles['invalid']} ${styles['valid']} ${styles['comment']}`}>

                                </textarea>
                            </div>
                            <div className={styles['form-buttons']}>
                                <a href="#" className={`${styles['btn']} ${styles['btn-post']}`}><i className="fa-solid fa-comment-medical"></i> Post</a>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-comment" className="modal-close"><i className="fa-solid fa-xmark"></i>
                            Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}