const mongoose = require('mongoose');

const { category } = require('../environments/constants');

const memeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [2, 'Name must be at least two characters long.'],
        maxlength: [50, 'Name must not exceed fifty characters.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/.+/, 'Image URL must start with http:// or https://'],
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        enum: {
            values: [...category],
            message: '{VALUE} is not supported'
        }
    },
    views: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: 'View must be an integer.',
        },
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Meme author is required.']
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: mongoose.Types.Decimal128, // https://mongoosejs.com/docs/search.html?q=Decimal128%20
        required: [true, 'Rating is required.'],
        default: 0,
    }
},
    // Enable the timestamps option createdAt, updatedAt
    { timestamps: true }
);

// Solution of problem is from https://github.com/Automattic/mongoose/issues/6268
// transform: (doc, ret) => {...}; -> doc (the original Mongoose document) and ret (the transformed JSON representation).
memeSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.rating) {
            ret.rating = parseFloat(ret.rating.toString());
        }

        return ret;
    },
});

const Meme = mongoose.model('Meme', memeSchema);

module.exports = { Meme }