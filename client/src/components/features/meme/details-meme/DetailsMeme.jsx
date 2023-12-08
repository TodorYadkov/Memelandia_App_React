import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import styles from './DetailsMeme.module.css';
import { useApi } from '../../../core/hooks/useApi';
import { scrollToTop } from '../../../utils/scrollToTop';
import { endpoint } from '../../../core/environments/constants';
import { useAuthContext } from '../../../core/hooks/useAuthContext';

import CardMeme from '../card-meme/CardMeme';
import Loading from '../../../shared/loader/Loading';
import Message from '../../../shared/messages/Message';
import ListComments from '../../comment/list-comments/ListComments';

export default function DetailsMeme() {
    const [allComments, setAllComments] = useState([]);                                                 // Use to show all comments
    const [currentMeme, setCurrentMeme] = useState({});                                                 // Save details for the current meme
    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState({ error: '' });                                  // Use to display various messages from the server

    const api = useApi();
    const navigate = useNavigate();
    const { memeId } = useParams('memeId');                                                             // Get memeId from query params
    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        document.title = 'Details';                                                                     // Add page title
        scrollToTop();                                                                                  // Scroll to the top of the page

        setIsLoading(true);
        api.get(endpoint.getMemeById(memeId))
            .then(memeDetails => setCurrentMeme(memeDetails))
            .catch(error => setServerMessage({ error: error.message }))
            .finally(() => setIsLoading(false));
    }, []);

    const handleDeleteMeme = () => {                                                                    // On delete meme redirect to catalog page (memeboard)
        navigate('/memes/catalog', { replace: true });
    };

    return (
        <section className={`${styles['details']} max-width`}>

            {(serverMessage?.error && !isLoading) && <Message type="error" message={serverMessage.error} />}

            {isLoading
                ? <Loading />
                : <>
                    <div className={styles['details-card']}>
                        {currentMeme?._id && <CardMeme {...currentMeme} setNewCommentHandler={setAllComments} onDeleteMeme={handleDeleteMeme} />}

                    </div>
                    {
                        isLoggedIn
                            ? (
                                <div className={styles['details-comments']}>
                                    {currentMeme?._id && <ListComments memeInfo={currentMeme} allComments={allComments} setAllComments={setAllComments} />}

                                </div>
                            )
                            : (
                                <div className={styles['details-comments']}>
                                    <h3 className={styles['details-comments-no-login']}>
                                        Please log in to view comments.
                                        <Link to="/login">Log in here <i className="fa-regular fa-face-grin"></i></Link>
                                    </h3>
                                </div>
                            )
                    }
                </>
            }

        </section>
    );
}