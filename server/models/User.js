const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: [true, 'Username is used.'],
        minlength: [2, 'Username must be at least two characters long.'],
        maxlength: [15, 'Username must be at least fifteen characters long.']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is used'],
        lowercase: true,
        validate: {
            validator: (v) => /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/.test(v),
            message: '{VALUE} is not a valid email address.'
        }
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [2, 'Name must be at least two characters long.'],
        maxlength: [30, 'Name must be at least thirty characters long.']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        validate: {
            validator: Number.isInteger,
            message: 'Age must be an integer number.',
        },
        validate: {
            validator: (v) => v >= 16 && v <= 120,
            message: 'Age must be between 16 and 120.'
        },
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        default: 0,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
},
    // Enable the timestamps option createdAt, updatedAt
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };