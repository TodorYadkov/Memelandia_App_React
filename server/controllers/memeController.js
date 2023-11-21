const router = require('express').Router();

const { preload } = require('../middlewares/preload');
const { isAuth, isOwner, isNotOwner } = require('../middlewares/guards');
const { validateMemeSchema, validateCommentSchema } = require('../util/validationSchemes');
const uploadImageImgBB = require('../util/uploadImageImgBB');
const {
    getAllMemes,
    getThreeTopRatedMemes,
    getMemeBySearch,
    getMemeById,
    getMemeByIdWithIncrementView,
    getAllMemesForUser,
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
        const [countMemesDocuments, memes] = await Promise.all([
            getMemeCountDocuments(),
            getAllMemes(page, limit),
        ]);

        const totalPages = Math.ceil(countMemesDocuments / limit); // Calculate total number of pages
        const payload = { memes, page, totalPages }; // On front-end receive object with array of memes, current page, and total pages with data

        res.status(200).json(payload);
    } catch (error) {
        next(error)
    }
});

// Get three top rated memes - Not logged
router.get('/three-top-rated', async (req, res, next) => {
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
        const { name, category } = req.query;
        // Get pagination options
        const page = parseInt(req.query.page) || 1;    // Get current page
        const limit = parseInt(req.query.limit) || 20; // Number of memes per page
        const foundMemes = await getMemeBySearch(name, category, page, limit); // foundMemes is object with array of found memes and total count of found document (total pages)

        const totalPages = Math.ceil(foundMemes.totalDocuments / limit); // Calculate total number of pages
        const payload = { memes: foundMemes.foundMemes, page, totalPages }; // On front-end receive object with array of searched memes, current page, and total pages with data

        res.status(200).json(payload);
    } catch (error) {
        next(error)
    }
});

// Get meme by ID - Not logged
router.get('/get-one/:memeId', async (req, res, next) => {
    try {

        const memeId = req.params.memeId;
        const meme = await getMemeByIdWithIncrementView(memeId);

        res.status(200).json(meme);
    } catch (error) {
        next(error)
    }
});

// Get all memes for user with pagination - Not logged
router.get('/for-user/:userId', async (req, res, next) => {
    try {

        const userId = req.params.userId;
        // From front-end send request with query params "page" and "limit"
        const page = parseInt(req.query.page) || 1;    // Get current page
        const limit = parseInt(req.query.limit) || 20; // Number of memes per page
        const allUserMemes = await getAllMemesForUser(userId, page, limit);

        const totalPages = Math.ceil(allUserMemes.totalDocuments / limit); // Calculate total number of pages
        const payload = {
            memes: allUserMemes.userMemes,
            page, totalPages,
            userMemesCount: allUserMemes.totalDocuments
        }; // On front-end receive object with array of user memes, current page, total pages and total count of the user's meme

        res.status(200).json(payload);
    } catch (error) {
        next(error)
    }
});

// Create meme - Logged
router.post('/create', isAuth, async (req, res, next) => {
    try {

        const memeData = req.body;
        // Image data must be base64
        const imageData = req.body.imageData;

        // Validate user input
        await validateMemeSchema.validateAsync(memeData);

        // Upload image to ImgBB
        const imgbbResponse = await uploadImageImgBB(imageData);

        // Get imageUrl from response
        const imageUrl = imgbbResponse.data.data.url;

        const userId = req.user._id;
        const newMeme = await addMeme(userId, { ...memeData, imageUrl });

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

        const memeId = req.params.memeId;
        const updatedMeme = await updateMeme(memeId, memeData);

        res.status(200).json(updatedMeme);
    } catch (error) {
        next(error)
    }
});

// Delete meme - Logged and owner
router.delete('/delete/:memeId', isAuth, preload(getMemeById), isOwner, async (req, res, next) => {
    try {

        const memeId = req.params.memeId;
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
        const memeId = req.params.memeId;
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
        const memeId = req.params.memeId;
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
router.get('/comments/get-one/:commentId', isAuth, preload(getCommentById, 'commentId'), isOwner, async (req, res, next) => {
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

        res.status(200).json(updatedComment);
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