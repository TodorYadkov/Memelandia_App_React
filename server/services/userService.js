const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/User.js');
const { Meme } = require('../models/Meme.js');
const { tokenBlackList } = require('../util/tokenBlackList.js');
const { ratingValue } = require('../environments/constants.js');

// Get environment variable
const ROUNDS_BCRYPT = Number(process.env.ROUNDS_BCRYPT);
const JWT_SECRET = process.env.JWT_SECRET;

async function userRegister(userData) {

    // Check if the username or email is already taken
    const isExisting = await User.findOne({ $or: [{ email: userData?.email }, { username: userData?.username }] });
    if (isExisting) {
        throw new Error('Username or email is already used!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, ROUNDS_BCRYPT);

    // Create new user
    const user = await User.create({ ...userData, password: hashedPassword });

    // Create token
    const userToken = await generateToken(user);

    // Return user info
    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            age: user.age,
            rating: user.rating,
            createdUser: user.createdAt,
            updatedUser: user.updatedAt
        }
    };
}

async function userLogin(userData) {

    // Check if the user exist
    const user = await User.findOne({ $or: [{ email: userData?.email }, { username: userData?.username }] });

    if (!user) {
        throw new Error('Invalid username or password!');
    }

    // Validate password
    const matchPassword = await bcrypt.compare(userData.password, user.password);
    if (!matchPassword) {
        throw new Error('Invalid username or password!');
    }

    // Create token
    const userToken = await generateToken(user);

    // Return user info
    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            age: user.age,
            rating: user.rating,
            createdUser: user.createdAt,
            updatedUser: user.updatedAt
        }
    };
}
// TODO: This could be optimized with a return email confirmation service
// This is for training purposes only, this check is not sufficient to accurately confirm a user's forgotten password
// Forgotten password
async function forgottenPassword(userData) {

    // Check if the user exist
    const user = await User.findOne({ $or: [{ email: userData?.email }, { username: userData?.username }] });
    if (!user) {
        throw new Error('Invalid credentials!');
    }

    if (user?.securityQuestion !== userData?.securityQuestion) {
        throw new Error('Invalid credentials!');
    }

    const result = { canChangePassword: true };
    if (!userData?.password || userData?.password === 0) {
        result.message = 'Please enter a new password.';
        return result;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, ROUNDS_BCRYPT);
    user.password = hashedPassword;
    await user.save();

    // Create token
    const userToken = await generateToken(user);

    // Return user info
    return {
        accessToken: userToken,
        userDetails: {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            age: user.age,
            rating: user.rating,
            createdUser: user.createdAt,
            updatedUser: user.updatedAt
        }
    };
}

async function userLogout(userToken) {
    // Only add token in black list
    tokenBlackList.add(userToken);
}

async function getUserById(userId) {
    // Select all without password (-password)
    return User.findById(userId).select('-password');
}


async function updateUserById(userData, userId) {
    // Update user details and run validators
    return User.findByIdAndUpdate(userId, userData, { runValidators: true, new: true })
}

const addRemoveFavorite = async (memeId, userId) => {
    // Get current meme to add in favorite
    const currentMeme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
    // Get author of the current meme
    const memeAuthor = await User.findById(currentMeme.author._id);
    // Get current user details
    const currentUser = await User.findById(userId);
    const result = {};

    // Check if the meme is already added in favorite
    if (currentUser.favorite.includes(memeId)) {
        // Remove meme from favorite array
        currentUser.favorite.splice(currentUser.favorite.indexOf(userId), 1);
        // Decrement rating values on meme
        currentMeme.rating -= ratingValue.increment;
        // Decrement rating values on author
        memeAuthor.rating -= ratingValue.increment;
        // Add message
        result.message = 'Successfully removed favorite meme.'

    } else {
        // Add new user in likes array
        currentUser.favorite.push(memeId);
        // Increment rating values on meme
        currentMeme.rating += ratingValue.increment;
        // Increment rating values on author
        memeAuthor.rating += ratingValue.increment;
        // Add message
        result.message = 'Successfully added new favorite meme.'
    }

    // Save documents
    await Promise.all([currentMeme.save(), memeAuthor.save(), currentUser.save()]);

    return result;
};

// JWT generate
async function generateToken(user) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                },
                JWT_SECRET,
                { expiresIn: '1d' },
                (err, signedToken) => {
                    if (err) {
                        reject(new Error('The token could not be signed!'));
                    } else {
                        resolve(signedToken);
                    }
                }
            );
        });

        return token;
    } catch (err) {
        throw new Error('An error occurred while generating the token!');
    }
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getUserById,
    updateUserById,
    forgottenPassword,
    addRemoveFavorite,
};