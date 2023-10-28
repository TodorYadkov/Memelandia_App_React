const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    memeId: {
        type: mongoose.Types.ObjectId,
        ref: 'Meme',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    like: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: 'View must be an integer.',
        },
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };