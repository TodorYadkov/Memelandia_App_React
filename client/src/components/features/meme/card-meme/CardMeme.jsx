/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './CardMeme.module.css';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import formatDateToTimeAgo from '../../../utils/formatDateToTimeAgo';
import Rating from '../../rating/Rating';
import AddCommentModal from '../../comment/add-comment/AddCommentModal';
import DeleteMemeModal from '../delete-meme/DeleteMemeModal';


export default function CardMeme({
    _id,
    name,
    author,
    category,
    dislikes,
    imageUrl,
    likes,
    rating,
    views,
    createdAt,
    updatedAt,
}) {
    const { isLoggedIn, getUserDetails } = useAuthContext();

    if (isLoggedIn) {
        const currentUser = {
            isLogged: isLoggedIn,
            // eslint-disable-next-line eqeqeq
            isOwner: getUserDetails?._id == author?._id,
        };


        return (
            <article className={styles['card']}>
                <header className={styles['card-header']}>

                    <h4><Link to={`/memes/details/${_id}`}>{name}</Link></h4>

                    <p className={styles['card-author-name']}>By: <Link to={`/memes/user-memes/${author._id}`}>{author.username}</Link>, <time>{formatDateToTimeAgo(createdAt)}</time> ago</p>
                    <div className={styles['card-meme-info']}>
                        <p className={styles['info']}>Category: <Link to={`/memes/catalog?category=${category}`}>{category}</Link></p>
                        <p className={styles['info']}><i className="fa-regular fa-eye"></i> {views}</p>
                        <p className={styles['info']}><i className="fa-regular fa-thumbs-up"></i> {likes.length}</p>
                        <p className={styles['info']}><i className="fa-regular fa-thumbs-down"></i> {dislikes.length}</p>

                        <Rating rating={rating} />
                    </div>
                </header>
                <div className={styles['card-img-wrapper']}>

                    <Link to={`/memes/details/${_id}`}><img src={imageUrl} alt={name} /></Link>
                </div>

                {currentUser?.isLoggedIn
                    ?
                    <footer className={styles['card-footer']}>
                        {currentUser?.isOwner
                            ?
                            <>
                                <p><a className={`btn ${styles['btn']} ${styles['edit']}`} href="#"><i className="fa-solid fa-pen-to-square"></i></a></p>
                                <label htmlFor="modal-toggle-meme-delete" className={`btn ${styles['btn']} ${styles['delete']} ${styles['modal-button']}`}><i className="fa-solid fa-trash"></i></label>
                            </>
                            :
                            <>
                                <p><a className={`btn ${styles['btn']} ${styles['like']}`} href="#"><i className="fa-solid fa-thumbs-up"></i></a></p>
                                <p><a className={`btn ${styles['btn']} ${styles['dislike']}`} href="#"><i className="fa-solid fa-thumbs-down"></i></a></p>
                                <p><a className={`btn ${styles['btn']} ${styles['comment']}`} href="#"><i className="fa-solid fa-message"></i></a></p>
                                <p><a className={`btn ${styles['btn']} ${styles['favorite']}`} href="#"><i className="fa-solid fa-heart"></i></a></p>
                            </>
                        }

                        <label htmlFor="modal-toggle-share" className={`btn ${styles['btn']} ${styles['share']} ${styles['modal-button']}`}><i
                            className="fa-solid fa-share-nodes"></i></label>
                    </footer>

                    : null
                }

            </article>
        );
    }
}

// <DeleteMemeModal />
// <AddCommentModal />