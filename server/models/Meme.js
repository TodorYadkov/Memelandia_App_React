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
        type: Number,
        required: [true, 'Rating is required.'],
        default: 0,
    }
},
    // Enable the timestamps option createdAt, updatedAt
    { timestamps: true }
);

const Meme = mongoose.model('Meme', memeSchema);

module.exports = { Meme }