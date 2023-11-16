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
            validator: (v) => v >= 12 && v <= 120,
            message: 'Age must be between 12 and 120.'
        },
    },
    favorite: [{
        type: mongoose.Types.ObjectId,
        ref: 'Meme'
    }],
    rating: {
        type: mongoose.Types.Decimal128,  // https://mongoosejs.com/docs/search.html?q=Decimal128%20
        required: [true, 'Rating is required.'],
        default: 0,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
    },
    securityQuestion: {
        type: String,
        required: [true, 'A security question is required to reset your password if you forget it.'],
        minlength: [6, 'Security question must be at least six characters long.'],
    }
},
    // Enable the timestamps option createdAt, updatedAt
    { timestamps: true }
);

// Solution of problem is from https://github.com/Automattic/mongoose/issues/6268
// transform: (doc, ret) => {...}; -> doc (the original Mongoose document) and ret (the transformed JSON representation).
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.rating) {
            ret.rating = parseFloat(ret.rating.toString());
        }
        
        return ret;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };