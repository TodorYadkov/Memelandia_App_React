const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/User.js');
const { Meme } = require('../models/Meme.js');
const { tokenBlackList } = require('../util/tokenBlackList.js');
const { ratingValue } = require('../environments/constants.js');
const { Comment } = require('../models/Comment.js');

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

    //Hash security question
    const hashedSecurityQuestion = await bcrypt.hash(userData.securityQuestion, ROUNDS_BCRYPT);

    // Create new user
    const userObject = await User.create({ ...userData, password: hashedPassword, securityQuestion: hashedSecurityQuestion });

    // Convert the user to a plain JavaScript object using toJSON 
    // (Convert Decimal128 instances to numbers (converting here because after create bypasses Mongoose methods, including toJSON in mongoose schema))
    const user = userObject.toJSON();

    // The number of comments and memes for the current user to display on their profile
    const [memesCount, commentsCount] = await Promise.all([
        Meme.countDocuments({ author: user._id }),
        Comment.countDocuments({ userId: user._id }),
    ]);

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
            favorite: user.favorite,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            memesCount: memesCount,
            commentsCount: commentsCount,
        }
    };
}

async function userLogin(userData) {

    // Check if the user exist
    const userObject = await User.findOne({ $or: [{ email: userData?.email }, { username: userData?.username }] });

    if (!userObject) {
        throw new Error('Invalid username or password!');
    }

    // Validate password
    const matchPassword = await bcrypt.compare(userData.password, userObject.password);
    if (!matchPassword) {
        throw new Error('Invalid username or password!');
    }

    // Convert the user to a plain JavaScript object using toJSON 
    // (Convert Decimal128 instances to numbers (converting here because after findOne bypasses Mongoose methods, including toJSON in mongoose schema))
    const user = userObject.toJSON();

    // The number of comments and memes for the current user to display on their profile
    const [memesCount, commentsCount] = await Promise.all([
        Meme.countDocuments({ author: user._id }),
        Comment.countDocuments({ userId: user._id }),
    ]);

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
            favorite: user.favorite,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            memesCount: memesCount,
            commentsCount: commentsCount,
        }
    };
}
// TODO: This could be optimized with a return email confirmation service
// This is for training purposes only, this check is not sufficient to accurately confirm a user's forgotten password
// Forgotten password
async function forgottenPassword(userData) {

    // Check if the user exist
    const userObject = await User.findOne({ $or: [{ email: userData?.email }, { username: userData?.username }] });
    if (!userObject) {
        throw new Error('Invalid credentials!');
    }

    // Validate security question
    const matchSecurityQuestion = await bcrypt.compare(userData.securityQuestion, userObject.securityQuestion);
    if (!matchSecurityQuestion) {
        throw new Error('Invalid credentials!');
    }

    const result = { canChangePassword: true };
    if (!userData?.password || userData?.password === 0) {
        result.message = 'Please enter a new password.';
        return result;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, ROUNDS_BCRYPT);
    userObject.password = hashedPassword;
    await userObject.save();

    // Convert the user to a plain JavaScript object using toJSON 
    // (Convert Decimal128 instances to numbers (converting here because after findOne bypasses Mongoose methods, including toJSON in mongoose schema))
    const user = userObject.toJSON();

    // The number of comments and memes for the current user to display on their profile
    const [memesCount, commentsCount] = await Promise.all([
        Meme.countDocuments({ author: user._id }),
        Comment.countDocuments({ userId: user._id }),
    ]);

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
            favorite: user.favorite,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            memesCount: memesCount,
            commentsCount: commentsCount,
        }
    };
}

async function userLogout(userToken) {
    // Only add token in black list
    tokenBlackList.add(userToken);
}

async function getUserById(userId) {
    // Select all without password (-password)
    const user = await User.findById(userId).select('-password -securityQuestion').populate('favorite').lean();
    const [memesCount, commentsCount] = await Promise.all([
        Meme.countDocuments({ author: userId }),
        Comment.countDocuments({ userId }),
    ]);

    // Convert Decimal128 instances to numbers (converting here  because lean() bypasses Mongoose methods, including toJSON in mongoose schema)
    if (user.rating) {
        user.rating = parseFloat(user.rating.toString());
    }

    return { ...user, memesCount, commentsCount };
}

async function updateUserById(userData, userId) {
    // Update user details, run validators and return update data
    const user = await User.findByIdAndUpdate(userId, userData, { runValidators: true, new: true, select: '-password -securityQuestion' }).lean();
    const [memesCount, commentsCount] = await Promise.all([
        Meme.countDocuments({ author: userId }),
        Comment.countDocuments({ userId }),
    ]);

    // Convert Decimal128 instances to numbers (converting here  because lean() bypasses Mongoose methods, including toJSON in mongoose schema)
    if (user.rating) {
        user.rating = parseFloat(user.rating.toString());
    }

    return { ...user, memesCount, commentsCount };
}

const addRemoveFavorite = async (memeId, userId) => {
    // Check if the current meme is already in favorite
    const isFavorite = await User.exists({ _id: userId, favorite: memeId });

    const result = {
        message: '',
        meme: {}
    };

    // Check if the meme is already added in favorite
    if (isFavorite) {
        // Remove meme from favorite array
        await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { favorite: memeId } },
            { runValidators: true, timestamps: false });

        // Decrement rating values on meme
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            { $inc: { rating: -ratingValue.increment } },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to decrement his rating
        const authorId = updatedMeme.author._id;

        // Decrement rating values on user author
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: -ratingValue.increment } },
            { runValidators: true, timestamps: false });

        // Add message
        result.message = 'Successfully removed favorite meme.'

    } else {
        // Add meme to favorite array
        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { favorite: memeId } },
            { runValidators: true, timestamps: false });

        // Increment rating values on meme
        const updatedMeme = await Meme.findOneAndUpdate(
            { _id: memeId },
            { $inc: { rating: ratingValue.increment } },
            { runValidators: true, timestamps: false })
            .populate('author', ['_id', 'username']);

        // Get author Id to increment his rating
        const authorId = updatedMeme.author._id;

        // Increment rating value on author
        await User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { rating: ratingValue.increment } },
            { runValidators: true, timestamps: false });

        // Add message
        result.message = 'Successfully added new favorite meme.'
    }

    // Return message and favorite meme
    result.meme = await Meme.findById(memeId).populate('author', ['_id', 'username']);
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