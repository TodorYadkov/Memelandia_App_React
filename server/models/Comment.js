const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [300, 'Comment must be be a maximum of three hundred characters long']
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };