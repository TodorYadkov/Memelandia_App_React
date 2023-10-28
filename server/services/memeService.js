const { Meme } = require("../models/Meme");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

const { ratingValue } = require("../environments/constants");

// Meme
const getAllMemes = (page = 1, limit = 20) => Meme.find({}).skip((page - 1) * limit).limit(limit).populate('author', 'username');

const getThreeTopRatedMemes = () => Meme.find().sort({ rating: -1 }).limit(3).populate('author', 'username');

const getMemeBySearch = async (nameValue = '', categoryValue = '', page = 1, limit = 20) => {
    // Create object with search criteria
    const searchCriteria = {
        name: { $regex: new RegExp(nameValue, 'gi') },
        category: { $regex: new RegExp(categoryValue, 'gi') }
    };
    // Calculate skip step
    const skipCount = (page - 1) * limit;
    // Count the total number founded documents
    const totalDocuments = await Meme.countDocuments(searchCriteria);
    const foundMemes = await Meme.find(searchCriteria).skip(skipCount).limit(limit).populate('author', 'username');

    return { foundMemes, totalDocuments };
};

const getMemeById = async (memeId) => Meme.findById(memeId).populate('author', 'username'); // This is only used for server side checks

const getMemeByIdWithIncrementView = async (memeId) => {
    const currentMeme = await Meme.findById(memeId).populate('author', 'username');
    // Increase views
    currentMeme.views += 1;
    await currentMeme.save();

    return currentMeme;
};

const addMeme = (userId, memeData) => Meme.create({ ...memeData, author: userId });

const updateMeme = (memeId, memeData) => Meme.findByIdAndUpdate(memeId, memeData, { runValidators: true, new: true }).populate('author', 'username');

const deleteMeme = async (memeId) => {
    const deletedMeme = await Meme.findByIdAndDelete(memeId);
    await Comment.deleteMany({ memeId });

    return deletedMeme;
};

const getMemeCountDocuments = () => Meme.countDocuments();

// Meme like, dislike
const addRemoveLike = async (memeId, userId) => {
    // Get current meme to like
    const currentMeme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    // Get author of the current meme
    const memeAuthor = await User.findById(currentMeme.author._id);
    const result = {};

    // Check if the author is already liked
    if (currentMeme.likes.includes(userId)) {
        // Remove user from likes array
        currentMeme.likes.splice(currentMeme.likes.indexOf(userId), 1);
        // Decrement rating values on meme
        currentMeme.rating -= ratingValue.increment;
        // Decrement rating values on author
        memeAuthor.rating -= ratingValue.increment;
        // Add message
        result.message = 'Successfully removed like.'

    } else {
        // Add new user in likes array
        currentMeme.likes.push(userId);
        // Increment rating values on meme
        currentMeme.rating += ratingValue.increment;
        // Increment rating values on author
        memeAuthor.rating += ratingValue.increment;
        // Add message
        result.message = 'Successfully added new like.'
    }

    // Save documents
    await Promise.all([currentMeme.save(), memeAuthor.save()]);

    result.currentMeme = currentMeme;
    return result;
};

const addRemoveDislike = async (memeId, userId) => {
    // Get current meme to dislike
    const currentMeme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    // Get author of the current meme
    const memeAuthor = await User.findById(currentMeme.author._id);
    const result = {};

    // Check if the author is already disliked
    if (currentMeme.dislikes.includes(userId)) {
        // Remove user from dislikes array
        currentMeme.dislikes.splice(currentMeme.dislikes.indexOf(userId), 1);
        // Increment rating values on meme
        currentMeme.rating += ratingValue.decrement;
        // Increment rating values on author
        memeAuthor.rating += ratingValue.decrement;
        // Add message
        result.message = 'Successfully removed dislike.'

    } else {
        // Add new user in dislikes array
        currentMeme.dislikes.push(userId);
        // Decrement rating values on meme
        currentMeme.rating -= ratingValue.decrement;
        // Decrement rating values on author
        memeAuthor.rating -= ratingValue.decrement;
        // Add message
        result.message = 'Successfully added new dislike.'
    }

    // Save documents
    await Promise.all([currentMeme.save(), memeAuthor.save()]);

    result.currentMeme = currentMeme;
    return result;
};

// Meme comments
const addComment = (commentData, memeId, userId) => {
    const { comment } = commentData;
    return Comment.create({ comment, memeId, userId });
};

const getAllComments = (memeId) => Comment.find({ memeId }).populate('userId', ['username', 'rating']);

const getCommentById = (commentId) => Comment.findById(commentId).populate('userId', ['username', 'rating']);

const updateComment = (commentData, commentId) => {
    const { comment } = commentData;
    return Comment.findByIdAndUpdate(commentId, { comment }, { runValidators: true, new: true });
};

const deleteComment = (commentId) => Comment.findByIdAndDelete(commentId, { returnDocument: true });

module.exports = {
    getAllMemes,
    getThreeTopRatedMemes,
    getMemeBySearch,
    getMemeById,
    getMemeByIdWithIncrementView,
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
}