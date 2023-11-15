const { Meme } = require("../models/Meme");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

const { ratingValue } = require("../environments/constants");

// Meme
const getAllMemes = (page = 1, limit = 20) => Meme.find({}).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).populate('author', 'username');

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
    // Increment views
    await Meme.updateOne({ _id: memeId }, { $inc: { views: 1 } }, { timestamps: false });

    return Meme.findById(memeId).populate('author', 'username');
};

const getAllMemesForUser = async (userId, page = 1, limit = 20) => {
    const userMemes = await Meme.find({ author: userId }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).populate('author', ['username', 'rating', 'createdAt']);
    // Count the total number of user's documents
    const totalDocuments = await Meme.countDocuments({ author: userId });

    return { userMemes, totalDocuments };
};

const addMeme = (userId, memeData) => Meme.create({ ...memeData, author: userId });

const updateMeme = (memeId, memeData) => Meme.findByIdAndUpdate(memeId, memeData, { runValidators: true, new: true }).populate('author', 'username');

const deleteMeme = async (memeId) => {
    const deletedMeme = await Meme.findByIdAndDelete(memeId);
    await Comment.deleteMany({ memeId });

    return deletedMeme;
};

const getMemeCountDocuments = () => Meme.countDocuments();

// Meme comments
const addComment = async (commentData, memeId, userId) => {
    const { comment } = commentData;
    const newComment = await Comment.create({ comment, memeId, userId });

    // Fetch the newly created meme with populated userId data
    const populatedComment = await Comment.findById(newComment._id).populate('userId', ['username', 'rating']);

    return populatedComment;
};

const getAllComments = (memeId) => Comment.find({ memeId }).sort({ _id: -1 }).populate('userId', ['username', 'rating']);

const getCommentById = (commentId) => Comment.findById(commentId).populate('userId', ['username', 'rating']);

const updateComment = (commentData, commentId) => {
    const { comment } = commentData;
    return Comment.findByIdAndUpdate(commentId, { comment }, { runValidators: true, new: true }).populate('userId', ['username', 'rating']);
};

const deleteComment = (commentId) => Comment.findByIdAndDelete(commentId, { returnDocument: true });

// Meme like
const addRemoveLike = async (memeId, userId) => {
    // Check if the meme exists and the user is not in both likes and dislikes arrays
    const memeExist = await Meme.findById(memeId).populate('author', ['_id', 'username']);

    if (!memeExist) {
        throw new Error('Meme not found.');
    }

    // Check if the user is in both likes and dislikes arrays
    const memeExistsBothArr = memeExist.likes.includes(userId) && memeExist.dislikes.includes(userId);

    if (memeExistsBothArr) {
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $pull: { likes: userId },
                $inc: { rating: -ratingValue.increment }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to decrement his rating
        const authorId = updatedMeme.author._id;

        // Decrement the author rating by an already increment value
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: -ratingValue.increment } },
            { runValidators: true, timestamps: false });

        throw new Error('User already in both likes and dislikes.');
    }

    // Check if the user is liked current meme
    const isLiked = await Meme.exists({ _id: memeId, likes: userId });

    const result = {
        message: '',
        meme: {}
    };

    if (isLiked) {
        // If already liked, remove user from likes array and decrement rating
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $pull: { likes: userId },
                $inc: { rating: -ratingValue.increment }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to decrement his rating
        const authorId = updatedMeme.author._id;

        // Decrement the author rating by an already increment value
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: -ratingValue.increment } },
            { runValidators: true, timestamps: false });

        result.message = 'Successfully removed like.';

    } else {
        // If not liked, add user to likes array and increment rating
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $push: { likes: userId },
                $inc: { rating: ratingValue.increment }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id
        const authorId = updatedMeme.author._id;

        // Increment the author rating
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: ratingValue.increment } },
            { runValidators: true, timestamps: false });

        result.message = 'Successfully added new like.';
    }

    // Return updated meme
    result.meme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    return result;
};

// Meme dislike
const addRemoveDislike = async (memeId, userId) => {
    // Check if the meme exists and the user is not in both likes and dislikes arrays
    const memeExist = await Meme.findById(memeId).populate('author', ['_id', 'username']);

    if (!memeExist) {
        throw new Error('Meme not found.');
    }

    // Check if the user is in both likes and dislikes arrays
    const memeExistsBothArr = memeExist.likes.includes(userId) && memeExist.dislikes.includes(userId);

    if (memeExistsBothArr) {
        // Remove user from dislikes array and throw new error
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $pull: { dislikes: userId },
                $inc: { rating: ratingValue.decrement }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to decrement his rating
        const authorId = updatedMeme.author._id;

        // Increment the author rating by an already decrement value
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: ratingValue.decrement } },
            { runValidators: true, timestamps: false });

        throw new Error('User already in both likes and dislikes.');
    }

    // Check if the user is disliked current meme
    const isDisliked = await Meme.exists({ _id: memeId, dislikes: userId });

    const result = {
        message: '',
        meme: {}
    };

    if (isDisliked) {
        // If already disliked, remove user from dislikes array and increment rating
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $pull: { dislikes: userId },
                $inc: { rating: ratingValue.decrement }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to decrement his rating
        const authorId = updatedMeme.author._id;

        // Increment the author rating by an already decrement value
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: ratingValue.decrement } },
            { runValidators: true, timestamps: false });

        result.message = 'Successfully removed dislike.'

    } else {
        // If not disliked, add user to dislikes array and decrement rating
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            {
                $push: { dislikes: userId },
                $inc: { rating: -ratingValue.decrement }
            },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id
        const authorId = updatedMeme.author._id;

        // Increment the author rating
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: -ratingValue.decrement } },
            { runValidators: true, timestamps: false });

        result.message = 'Successfully added new dislike.';
    }

    // Return updated meme
    result.meme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    return result;
};

module.exports = {
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
}