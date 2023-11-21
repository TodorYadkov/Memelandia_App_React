/* eslint-disable react/prop-types */
import styles from '../CreateMeme.module.css';

export default function ConfirmClearFormModal({ modalHandler, resetForm, setIsValidForm }) {

    const resetFormClickHandler = () => {                                                               // Clear form data and close modal
        resetForm();                                                                                    // Clear form data and remove current template
        setIsValidForm(false);                                                                          // Reset the form's valid state to false and disable the create button
        modalHandler();                                                                                 // Close modal
    };

    return (
        <div className="comment-modal">
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-broom"></i> Confirm form clear</h4>
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-rectangle-xmark"></i></button>
                    </div>
                    <div className="modal-content">
                        <div className={styles['modal-clear-content']}>
                            <h4>Are you sure you want to clear the current meme?</h4>
                            <button
                                onClick={resetFormClickHandler}
                                className={`btn ${styles['btn-clear']}`}
                            ><i className="fa-solid fa-broom"></i> Clear</button>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={modalHandler} className="modal-close"><i className="fa-solid fa-xmark"></i> Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}