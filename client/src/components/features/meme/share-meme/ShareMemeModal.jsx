import styles from './ShareMemeModal.module.css';

export default function ShareMemeModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-share" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-regular fa-share-from-square"></i> Share with friends</h4>
                        <label htmlFor="modal-toggle-share" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className={`modal-content ${styles['modal-content']}`}>
                        <input className={styles['input']} type="text" defaultValue="Test" readOnly />
                        <button className={`${styles['btn']} ${styles['btn-copy']}`}><i className="fa-regular fa-copy"></i> Copy</button>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-share" className="modal-close"><i className="fa-solid fa-xmark"></i> Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}