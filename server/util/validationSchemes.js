const joi = require('joi');
// Registration
const registrationSchema = joi.object({
    username: joi.string().min(2).max(15).required().trim().messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least two characters long',
        'string.max': 'Username must not exceed fifteen characters',
        'any.required': 'Username is required',
    }),

    email: joi.string().email().required().lowercase().trim().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),

    name: joi.string().min(2).max(30).required().trim().messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least two characters long',
        'string.max': 'Name must not exceed thirty characters',
        'any.required': 'Name is required',
    }),

    age: joi.number().integer().min(16).max(120).required().messages({
        'number.base': 'Age must be a number',
        'number.integer': 'Age must be an integer number',
        'number.min': 'Age must be at least 16 years old',
        'number.max': 'Age must not exceed 120  years old',
        'any.required': 'Age is required',
    }),

    password: joi.string().required().messages({
        'string.base': 'Password must be a string',
        'any.required': 'Password is required',
    })
});

// Login
const loginSchema = joi.object({
    username: joi.string().max(15).trim().messages({
        'string.base': 'Username must be a string',
        'string.max': 'Username must not exceed fifteen characters',
    }),

    email: joi.string().email().lowercase().trim().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
    }),

    password: joi.string().required().messages({
        'string.base': 'Password must be a string',
        'any.required': 'Password is required',
    })
});

// Edit user details
const updateUserSchema = joi.object({
    username: joi.string().min(2).max(15).required().trim().messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least two characters long',
        'string.max': 'Username must not exceed fifteen characters',
        'any.required': 'Username is required',
    }),

    email: joi.string().email().required().lowercase().trim().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),

    name: joi.string().min(2).max(30).required().trim().messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least two characters long',
        'string.max': 'Name must not exceed thirty characters',
        'any.required': 'Name is required',
    }),

    age: joi.number().integer().min(16).max(120).required().messages({
        'number.base': 'Age must be a number',
        'number.integer': 'Age must be an integer number',
        'number.min': 'Age must be at least 16 years old',
        'number.max': 'Age must not exceed 120  years old',
        'any.required': 'Age is required',
    }),

    password: joi.string().messages({
        'string.base': 'Password must be a string',
    })
});

module.exports = { registrationSchema, loginSchema, updateUserSchema };