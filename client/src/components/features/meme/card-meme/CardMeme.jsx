import styles from './CardMeme.module.css';
import AddCommentModal from "../../comment/add-comment/AddCommentModal";
import Rating from "../../rating/Rating";
import DeleteMemeModal from "../delete-meme/DeleteMemeModal";

export default function CardMeme() {
    return (
        <article className={styles['card']}>
            <header className={styles['card-header']}>
                {/* <!-- Link to details --> */}
                <h4><a href="#">Test meme card</a></h4>
                {/* <!-- Link to all author meme --> */}
                <p className={styles['card-author-name']}>By: <a href="#">Peter</a>, <time>14h</time> ago</p>
                <div className={styles['card-meme-info']}>

                    <Rating />

                    <p className={styles['info']}><a href="#">Category</a></p>
                    <p className={styles['info']}><i className="fa-regular fa-eye"></i> 111</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> 111</p>
                    <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> 111</p>
                    <p className={styles['info']}><i className="fa-regular fa-message"></i> 111</p>
                </div>
            </header>
            <div className={styles['card-img-wrapper']}>
                {/* <!-- Link to details --> */}
                <a href="#"><img src="/assets/test-meme.jpg" alt="Meme name" /></a>
            </div>
            {/* <!-- Only logged user --> */}
            <footer className={styles['card-footer']}>
                {/* <!-- Not owner --> */}
                <p><a className={`btn ${styles['btn']} ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
                <p><a className={`btn ${styles['btn']} ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
                <p><a className={`btn ${styles['btn']} ${styles['comment']}`} href="#"><i className="fa-solid fa-message"></i></a></p>
                <p><a className={`btn ${styles['btn']} ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p>
                {/* <!-- Owner --> */}
                <p><a className={`btn ${styles['btn']} ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
                <label htmlFor="modal-toggle-meme-delete" className={`btn ${styles['btn']} ${styles['delete']} ${styles['modal-button']}`}><i className="fa-solid fa-trash"></i></label>
                {/* <!-- Owner and not owner --> */}
                <label htmlFor="modal-toggle-share" className={`btn ${styles['btn']} ${styles['share']} ${styles['modal-button']}`}><i
                    className="fa-solid fa-share-nodes"></i></label>
            </footer>

            <DeleteMemeModal />
            <AddCommentModal />

        </article>
    );
}














// Card meme HOME Page
{/* <article className={styles['card']}>
<header className={styles['card-header']}>
    <!-- Link to details -->
    <h4><a href="#">Test meme card</a></h4>
    <!-- Link to all author meme -->
    <p className={styles['card-author-name']}>By: <a href="#">Peter</a>, <time>14h</time> ago</p>
    <div className={styles['card-meme-info']}>
        <div className={styles['rating']}>
            <span className={`${styles['rating-star']} ${styles['active']}`} data-rating="1"></span>
            <span className={styles['rating-star']} data-rating="2"></span>
            <span className={styles['rating-star']} data-rating="3"></span>
            <span className={styles['rating-star']} data-rating="4"></span>
            <span className={styles['rating-star']} data-rating="5"></span>
        </div>
        <p className={styles['info']}><a href="#">Category</a></p>
        <p className={styles['info']}><i className="fa-regular fa-eye"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-message"></i> 111</p>
    </div>
</header>
<div className={styles['card-img-wrapper']}>
    <!-- Link to details -->
    <a href="#"><img src="./assets/test-meme.jpg" alt="Meme name" /></a>
</div>
<!-- Only logged user -->
<footer className={styles['card-footer']}>
    <!-- Not owner -->
    <p><a className={`${styles['btn']} ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
    <p><a className={`${styles['btn']} ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
    <!-- Modal comment -->
    <label htmlFor="modal-toggle-comment" className={`${styles['btn']} ${styles['comment']} ${styles['modal-button']}`}><i
        className="fa-solid fa-message"></i></label>
    <p><a className={`${styles['btn']} ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p>
    <!-- Owner -->
    <p><a className={`${styles['btn']} ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
    <label htmlFor="modal-toggle-meme-delete" className={`${styles['btn']} ${styles['delete']} ${styles['modal-button']}`}><i className="fa-solid fa-trash"></i></label>
    <!-- Owner and not owner -->
    <!-- Modal share -->
    <label htmlFor="modal-toggle-share" className={`${styles['btn']} ${styles['share']} ${styles['modal-button']}`}><i
        className="fa-solid fa-share-nodes"></i></label>
</footer>

</article> */}









// Card meme details page
{/* <article className={styles['card']}>
<header className={styles['card-header']}>
    <!-- Link to details -->
    <h4><a href="#">Test meme card</a></h4>
    <!-- Link to all author meme -->
    <p className={styles['card-author-name']}>By: <a href="#">Peter</a>, <time>14h</time> ago</p>
    <div className={styles['card-meme-info']}>
        <div className={styles['rating']}>
            <span className={`${styles['rating-star']} ${styles['active']}`} data-rating="1"></span>
            <span className={styles['rating-star']} data-rating="2"></span>
            <span className={styles['rating-star']} data-rating="3"></span>
            <span className={styles['rating-star']} data-rating="4"></span>
            <span className={styles['rating-star']} data-rating="5"></span>
        </div>
        <p className={styles['info']}><a href="#">Category</a></p>
        <p className={styles['info']}><i className="fa-regular fa-eye"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-message"></i> 111</p>
    </div>
</header>
<div className={styles['card-img-wrapper']}>
    <!-- Link to details -->
    <a href="#"><img src="/assets/test-meme.jpg" alt="Meme name" /></a>
</div>
<!-- Only logged user -->
<footer className={styles['card-footer']}>
    <!-- Not owner -->
    <!-- When someone click on like, dislike, favorite add class to be marked -->
    <!-- <p><a className={`${styles['btn']} ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
<p><a className={`${styles['btn']} ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
<p><a className={`${styles['btn']} ${styles['comment']}`} href="#"><i className="fa-solid fa-message"></i></a></p>
<p><a className={`${styles['btn']} ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p> -->
    <!-- Owner -->
    <p><a className={`${styles['btn']} ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
    <label htmlFor="modal-toggle-meme-delete" className={`${styles['btn']} ${styles['delete']} ${styles['modal-button']}`}><i className="fa-solid fa-trash"></i></label>
    <!-- Owner and Not owner -->
    <label htmlFor="modal-toggle-share" className={`${styles['btn']} ${styles['share']} ${styles['modal-button']}`}><i
        className="fa-solid fa-share-nodes"></i></label>
</footer>

</article> */}

















// Card meme Profile
{/* <article className={styles['card']}>
<header className={styles['card-header']}>
    <!-- Link to details -->
    <h4><a href="#">Test meme card</a></h4>
    <!-- Link to all author meme -->
    <p className={styles['card-author-name']}>By: <a href="#">Peter</a>, <time>14h</time> ago</p>
    <div className={styles['card-meme-info']}>
        <div className={styles['rating']}>
            <span className={`${styles['rating-star']} ${styles['active']}`} data-rating="1"></span>
            <span className={styles['rating-star']} data-rating="2"></span>
            <span className={styles['rating-star']} data-rating="3"></span>
            <span className={styles['rating-star']} data-rating="4"></span>
            <span className={styles['rating-star']} data-rating="5"></span>
        </div>
        <p className={styles['info']}><a href="#">Category</a></p>
        <p className={styles['info']}><i className="fa-regular fa-eye"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> 111</p>
        <p className={styles['info']}><i className="fa-regular fa-message"></i> 111</p>
    </div>
</header>
<div className={styles['card-img-wrapper']}>
    <!-- Link to details -->
    <a href="#"><img src="/assets/test-meme.jpg" alt="Meme name" /></a>
</div>
<!-- Only logged user -->
<footer className={styles['card-footer']}>
    <!-- Not owner -->
    <!-- When someone click on like, dislike, favorite add class to be marked -->
    <!-- <p><a className={`${styles['btn']} ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
<p><a className={`${styles['btn']} ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
<p><a className={`${styles['btn']} ${styles['comment']}`} href="#"><i className="fa-solid fa-message"></i></a></p>
<p><a className={`${styles['btn']} ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p> -->
    <!-- Owner -->
    <p><a className={`${styles['btn']} ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
    <label htmlFor="modal-toggle-meme-delete" className={`${styles['btn']} ${styles['delete']} ${styles['modal-button']}`}><i
        className="fa-solid fa-trash"></i></label>
    <!-- Owner and Not owner -->
    <label htmlFor="modal-toggle-share" className={`${styles['btn']} ${styles['share']} ${styles['modal-button']}`}><i
        className="fa-solid fa-share-nodes"></i></label>
</footer>

</article> */}