import styles from './DetailsMeme.module.css';
import DeleteCommentModal from "../../comment/delete-comment/DeleteCommentModal";
import EditCommentModal from "../../comment/edit-comment/EditComentModal";
import ShareMemeModal from "../share-meme/ShareMemeModal";
import CardMeme from '../card-meme/CardMeme';

export default function DetailsMeme() {
    return (
        <section className={`${styles['details']} ${styles['max-width']}`}>
            
            <CardMeme />

            <div className={styles['all-comments']}>
                <div className={styles['comments-wrapper-heading']}>
                    <h3>Comments</h3>
                </div>
                {/* <!-- One comment --> */}
                <div className={styles['comment']}>
                    <div className={styles['comment-author-wrapper']}>
                        <p className={styles['comment-author']}>Peter</p>
                        {/* <!-- If the current user is owner --> */}
                        <div className={styles['comment-buttons']}>
                            <p><time>22.02.2023 </time></p>
                            <label htmlFor="modal-toggle-comment-edit" className={`btn ${styles['btn']} ${styles['comment-edit']} ${styles['modal-button']}`}><i
                                className="fa-solid fa-pen-to-square"></i></label>

                            <label htmlFor="modal-toggle-comment-delete" className={`btn ${styles['btn']} ${styles['comment-delete']} ${styles['modal-button']}`}><i
                                className="fa-solid fa-trash"></i></label>
                        </div>
                    </div>
                    <p className={styles['comment-text']}>Best meme ever!</p>
                </div>

            </div>

            <EditCommentModal />
            <DeleteCommentModal />
            <ShareMemeModal />
        </section >
    );
}