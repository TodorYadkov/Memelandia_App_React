const mongoose = require('mongoose');

// Global error handler
module.exports = (err, req, res, next) => {
    // Get status code
    const statusCode = err.statusCode || 400;

    if (err instanceof mongoose.Error.ValidationError) {
        // Mongoose validation error
        return res.status(statusCode).json({ message: Object.values(err.errors).map(error => error.message).join(', '), statusCode });

    } else if (err instanceof mongoose.Error) {
        // Other Mongoose errors
        if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ message: 'Duplicate key error', statusCode: 400 });

        } else {
            // Other Mongoose errors
            return res.status(400).json({ message: 'Mongoose error: ' + err.message, statusCode: 400 });
        }
        
    } else if (err.isJoi) {
        // Joi library validation error
        return res.status(statusCode).json({ message: err.details.map(error => error.message).join(', '), statusCode });

    } else if (err instanceof Error) {
        // Custom server error
        return res.status(statusCode).json({ message: err.message, statusCode });

    } else if (err instanceof TypeError) {
        // Custom server error
        return res.status(statusCode).json({ message: err.message, statusCode });
    }


    // General Express errors
    res.status(500).json({ message: 'Internal server error', error: err, statusCode: 500 });
};