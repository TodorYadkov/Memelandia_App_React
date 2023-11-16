const router = require('express').Router();

const { validateUserRegistrationSchema, validateUserLoginSchema, validateUserUpdateUserSchema } = require('../util/validationSchemes');
const { userRegister, userLogin, userLogout, getUserById, updateUserById, forgottenPassword, addRemoveFavorite } = require('../services/userService');
const { getMemeById } = require('../services/memeService');

const { isGuest, isAuth, isNotOwner } = require('../middlewares/guards');
const { preload } = require('../middlewares/preload');

// User register - Not logged in
router.post('/register', isGuest, async (req, res, next) => {
    try {
        // Validate user input
        await validateUserRegistrationSchema.validateAsync(req.body);

        const userData = req.body;
        const userInfo = await userRegister(userData);

        res.status(201).json(userInfo);
    } catch (error) {
        next(error);
    }
});

// User login - Not logged in
router.post('/login', isGuest, async (req, res, next) => {
    try {
        // Validate user input
        await validateUserLoginSchema.validateAsync(req.body);

        const userData = req.body;
        const userInfo = await userLogin(userData);

        res.status(200).json(userInfo);
    } catch (error) {
        next(error);
    }
});

// User logout - Logged in
router.get('/logout', isAuth, async (req, res, next) => {
    try {

        const userToken = req.userToken;
        await userLogout(userToken)

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
});

// Get user by Id - Logged in
router.get('/profile', isAuth, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await getUserById(userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Update user by id - Logged in
router.put('/profile', isAuth, async (req, res, next) => {
    try {
        // Validate user input
        await validateUserUpdateUserSchema.validateAsync(req.body);

        const userData = req.body;
        const userId = req.user._id;
        const user = await updateUserById(userData, userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Forgotten password
// TODO: This could be optimized with a return email confirmation service, now is only for school purpose
router.put('/forgotten-password', isGuest, async (req, res, next) => {
    try {
        // Validate user input
        await validateUserUpdateUserSchema.validateAsync(req.body);

        const userData = req.body;
        const result = await forgottenPassword(userData); // Result for this function is object with message for accept change password or accessToken

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Add - remove favorite meme from user - Logged and Not Owner
router.get('/favorite/:memeId', isAuth, preload(getMemeById), isNotOwner, async (req, res, next) => {
    try {

        const userId = req.user._id;
        const memeId = req.params.memeId;
        const result = await addRemoveFavorite(memeId, userId); // Return an object with message which action is enabled and favorite meme

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
});

module.exports = router;