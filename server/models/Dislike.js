const mongoose = require('mongoose');

const dislikeSchema = new mongoose.Schema({
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
    dislike: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: 'View must be an integer.',
        },
    }
});

const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike };