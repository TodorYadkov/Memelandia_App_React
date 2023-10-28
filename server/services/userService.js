const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/User.js');
const { tokenBlackList } = require('../util/tokenBlackList.js');

// Get environment variable
const ROUNDS_BCRYPT = Number(process.env.ROUNDS_BCRYPT);
const JWT_SECRET = process.env.JWT_SECRET;

async function userRegister(userData) {
    const { username, email, name, age, password } = userData;
    // Check if the username or email is already taken
    const isExisting = await User.findOne({ $or: [{ email }, { username }] });
    if (isExisting) {
        throw new Error('Username or email is already used!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, ROUNDS_BCRYPT);

    // Create and save new user
    const user = await User.create({
        username,
        email,
        name,
        age,
        password: hashedPassword
    });

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
            createdUser: user.createdAt,
            updatedUser: user.updatedAt
        }
    };
}

async function generateToken(user) {
    try {
        const token = await new Promise((resolve, reject) => {
            jwt.sign({ username: user.username },
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

async function userLogout(userToken) {
    tokenBlackList.add(userToken);
}

const getUserById = (userId) => User.findById(userId).select('-password'); // Select all without password (-password)

const updateUserById = (userData, userId) => {
    const { username, email, name, age } = userData;
    return User.findByIdAndUpdate(userId, { username, email, name, age }, { runValidators: true, new: true })
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    getUserById,
    updateUserById,
};