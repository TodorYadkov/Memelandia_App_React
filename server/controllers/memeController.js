const router = require('express').Router();

const { preload } = require('../middlewares/preload');
const { isAuth, isOwner, isNotOwner } = require('../middlewares/guards');
const { validateMemeSchema, validateCommentSchema } = require('../util/validationSchemes');
const {
    getAllMemes,
    getThreeTopRatedMemes,
    getMemeBySearch,
    getMemeById,
    addMeme,
    updateMeme,
    deleteMeme,
    getMemeCountDocuments,
    addRemoveLike,
    addRemoveDislike,
    addComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
} = require('../services/memeService');

// Get all memes with pagination - Not logged
router.get('/', async (req, res, next) => {
    try {
        // From front-end send request with query params "page" and "limit"
        const page = parseInt(req.query.page) || 1;    // Get current page
        const limit = parseInt(req.query.limit) || 20; // Number of memes per page
        const [countMemesDocuments, allMemes] = await Promise.all([
            getMemeCountDocuments(),
            getAllMemes(page, limit),
        ]);

        const totalPages = Mth.ceil(countMemesDocuments / limit); // Calculate total number of pages
        const payload = { allMemes, page, totalPages }; // On front-end receive object with array of memes, current page, and total pages with data

        res.status(200).json(payload);
    } catch (error) {
        next(error)
    }
});

// Get three top rated memes - Not logged
router.get('/last-three-added', async (req, res, next) => {
    try {

        const threeTopRatedMemes = await getThreeTopRatedMemes();

        res.status(200).json(threeTopRatedMemes);
    } catch (error) {
        next(error)
    }
});

// Get meme by search - Not logged
router.get('/search', async (req, res, next) => {
    try {
        // Search by name and category
        // Get pagination options
        const { name, category, page, limit } = req.query;
        const foundMemes = await getMemeBySearch(name, category, page, limit); // foundMemes is object with array of found memes and total count of found document (total pages)

        const totalPages = Mth.ceil(foundMemes.totalDocuments / limit); // Calculate total number of pages
        const payload = { foundMemes: foundMemes.foundMemes, page, totalPages }; // On front-end receive object with array of searched memes, current page, and total pages with data

        res.status(200).json(payload);
    } catch (error) {
        next(error)
    }
});

// Get meme by ID - Not logged
router.get('/:memeId', async (req, res, next) => {
    try {

        const memeId = req.params.memeId;
        const meme = await getMemeById(memeId);

        res.status(200).json(meme);
    } catch (error) {
        next(error)
    }
});

// Create meme - Logged
router.post('/create', isAuth, async (req, res, next) => {
    try {

        const memeData = req.body;
        // Validate user input
        await validateMemeSchema.validateAsync(memeData);

        const userId = req.user._id;
        const newMeme = await addMeme(userId, memeData);

        res.status(201).json(newMeme);
    } catch (error) {
        next(error)
    }
});

// Edit meme - Logged and owner
router.put('/edit/:memeId', isAuth, preload(getMemeById), isOwner, async (req, res, next) => {
    try {

        const memeData = req.body;
        // Validate user input
        await validateMemeSchema.validateAsync(memeData);

        const memeId = req.user._id;
        const updatedMeme = await updateMeme(memeId, memeData);

        res.status(200).json(updatedMeme);
    } catch (error) {
        next(error)
    }
});

// Delete meme - Logged and owner
router.delete('/delete/:memeId', isAuth, preload(getMemeById), isOwner, async (req, res, next) => {
    try {

        const memeId = req.user._id;
        const deletedMeme = await deleteMeme(memeId);

        res.status(200).json({ message: 'Meme is successfully deleted.', deletedMeme });
    } catch (error) {
        next(error)
    }
});

// Add - remove like on meme - Logged and Not Owner
router.get('/like/:memeId', isAuth, preload(getMemeById), isNotOwner, async (req, res, next) => {
    try {

        const userId = req.user._id;
        const result = await addRemoveLike(memeId, userId); // Return an object with the current meme and a message which action is enabled

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
});

// Add - remove dislike on meme - Logged and Not Owner
router.get('/dislike/:memeId', isAuth, preload(getMemeById), isNotOwner, async (req, res, next) => {
    try {

        const userId = req.user._id;
        const result = await addRemoveDislike(memeId, userId); // Return an object with the current meme and a message which action is enabled

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
});

// Get all comments - Logged
router.get('/comments/:memeId', isAuth, async (req, res, next) => {
    try {

        const memeId = req.params.memeId;
        const allComments = await getAllComments(memeId);

        res.status(200).json(allComments);
    } catch (error) {
        next(error)
    }
});

// Get comment by Id - Logged and Owner
router.get('/comments/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const comment = await getCommentById(commentId); // With populated username and rating

        res.status(200).json(comment);
    } catch (error) {
        next(error)
    }
});

// Add comment - Logged and Not Owner
router.post('/comments/:memeId', isAuth, preload(getMemeById), isNotOwner, async (req, res, next) => {
    try {

        const commentData = req.body;
        // Validate user input
        await validateCommentSchema.validateAsync(commentData);

        const memeId = req.params.memeId;
        const userId = req.user._id;
        const newComment = await addComment(commentData, memeId, userId);

        res.status(201).json(newComment);
    } catch (error) {
        next(error)
    }
});

// Edit comment - Logged and Owner
router.put('/comments/edit/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentData = req.body;
        // Validate user input
        await validateCommentSchema.validateAsync(commentData);

        const commentId = req.params.commentId;
        const updatedComment = await updateComment(commentData, commentId);

        res.status(200).json(updateComment);
    } catch (error) {
        next(error)
    }
});

// Delete comment - Logged and Owner
router.delete('/comments/delete/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const deletedComment = await deleteComment(commentId);

        res.status(200).json({ message: 'Comment is successfully deleted.', deletedComment });
    } catch (error) {
        next(error)
    }
});


module.exports = router;