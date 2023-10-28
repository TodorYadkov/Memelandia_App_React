const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [2, 'Name must be at least two characters long.'],
        maxlength: [50, 'Name must be at least fifty characters long.']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\/[^ ]+$/gi, 'Image URL must start with http:// or https://'],
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        enum: {
            values: ['Funny', 'Sports', 'Politics', 'Science',
                'Technology', 'Food', 'Travel', 'Music', 'Movies',
                'Gaming', 'Literature', 'Nature', 'Art', 'History',
                'Fashion', 'Fitness', 'Animals', 'Celebrities',
                'Hobbies', 'Educational', 'Inspirational',
                'Relationships', 'Humor', 'Other'],
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
    }
},
    // Enable the timestamps option createdAt, updatedAt
    { timestamps: true }
);

const Meme = mongoose.model('Meme', memeSchema);

module.exports = { Meme }