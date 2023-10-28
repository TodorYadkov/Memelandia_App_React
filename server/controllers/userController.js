const router = require('express').Router();
const { userRegister, userLogin, userLogout, getUserById, updateUserById } = require('../services/userService');
const { onlyForGuest, isAuth } = require('../middlewares/guards');
const { validateUserRegistrationSchema, validateUserLoginSchema, validateUserUpdateUserSchema } = require('../util/validationSchemes');

// User register - Not logged in
router.post('/register', onlyForGuest, async (req, res, next) => {
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
router.post('/login', onlyForGuest, async (req, res, next) => {
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

// Get user by id - Logged in
router.get('/profile/:userId', isAuth, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await getUserById(userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// Update user by id - Logged in
router.put('/profile/edit/:userId', isAuth, async (req, res, next) => {
    try {

        // Validate user input
        await validateUserUpdateUserSchema.validateAsync(req.body);

        const userData = req.body;
        const userId = req.params.userId;
        const user = await updateUserById(userData, userId);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;