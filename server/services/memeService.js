const { Meme } = require("../models/Meme");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

const { ratingValue } = require("../environments/constants");

// Meme
const getAllMemes = (page, limit) => Meme.find({}).skip((page - 1) * limit).limit(limit).populate('author', 'username');

const getThreeTopRatedMemes = () => Meme.find().sort({ rating: -1 }).limit(3).populate('author', 'username');

const getMemeBySearch = (nameValue = '', categoryValue = '') => Meme.find(
    {
        name: { $regex: new RegExp(nameValue, 'gi') },
        category: { $regex: new RegExp(categoryValue, 'gi') }
    }
).populate('author', 'username');

const getMemeById = async (memeId) => {
    const currentMeme = await Meme.findById(memeId).populate('author', 'username');
    // Increase views
    currentMeme.views += 1;
    await currentMeme.save();

    return currentMeme;
};

const addMeme = (userId, memeData) => Meme.create({ ...memeData, author: userId }).populate('author', 'username');

const updateMeme = (memeId, memeData) => Meme.findByIdAndUpdate(memeId, memeData, { runValidators: true, new: true }).populate('author', 'username');

const deleteMeme = async (memeId) => {
    const deletedMeme = await Meme.findByIdAndDelete(memeId);
    await Comment.deleteMany({ memeId });

    return deletedMeme;
};

// Meme like, dislike
const addRemoveLike = async (memeId, userId) => {
    // Get current meme to like
    const currentMeme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    // Get author of the current meme
    const memeAuthor = await User.findById(currentMeme.author._id);

    // Check if the author is already liked
    if (currentMeme.likes.includes(userId)) {
        // Remove user from likes array
        currentMeme.likes.splice(currentMeme.likes.indexOf(userId), 1);
        // Decrement rating values on meme
        currentMeme.rating -= ratingValue.decrement;
        // Decrement rating values on author
        memeAuthor.rating -= ratingValue.decrement;

    } else {
        // Add new user in likes array
        currentMeme.likes.push(userId);
        // Increment rating values on meme
        currentMeme.rating += ratingValue.increment;
        // Increment rating values on author
        memeAuthor.rating += ratingValue.increment;
    }

    // Save documents
    await Promise.all([currentMeme.save(), memeAuthor.save()]);

    return currentMeme;
};

// Meme comments
const addComment = (commentData, memeId, userId) => {
    const { comment } = commentData;
    return Comment.create({ comment, memeId, userId });
};

const getCommentById = (commentId) => Comment.findById(commentId).populate('userId', ['username', 'rating']);

const getAllComments = (memeId) => Comment.find({ memeId }).populate('userId', ['username', 'rating']);

const updateComment = (commentData, commentId) => {
    const { comment } = commentData;
    return Comment.findByIdAndUpdate(commentId, { comment }, { runValidators: true, new: true });
};


module.exports = {
    getAllMemes,
    getThreeTopRatedMemes,
    getMemeBySearch,
    getMemeById,
    addMeme,
    updateMeme,
    deleteMeme,
    addRemoveLike,
    addComment,
    getCommentById,
    getAllComments,
    updateComment,
}