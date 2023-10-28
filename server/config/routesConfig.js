const displayReq = require('../middlewares/displayReq');
const userController = require('../controllers/userController');
const memeController = require('../controllers/memeController');

module.exports = (app) => {
    // Display each request
    app.use(displayReq());

    // Main routes
    app.use('/memes', memeController);
    app.use('/users', userController);

    // Use 404 no content
    app.all('*', (req, res, next) => {
        try {
            throw new Error(`No content - path ${req.path} is not found.`);

        } catch (error) {

            error.statusCode = 404;
            next(error);
        }
    });
};