const joi = require('joi');
const { category } = require('../environments/constants');

// Validate input on register
const validateUserRegistrationSchema = joi.object({
    username: joi.string().trim().min(2).max(15).required().messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least two characters long',
        'string.max': 'Username must not exceed fifteen characters',
        'any.required': 'Username is required',
    }),

    email: joi.string().trim().email().required().lowercase().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),

    name: joi.string().trim().min(2).max(30).required().messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least two characters long',
        'string.max': 'Name must not exceed thirty characters',
        'any.required': 'Name is required',
    }),

    age: joi.number().integer().min(12).max(120).required().messages({
        'number.base': 'Age must be a number',
        'number.integer': 'Age must be an integer number',
        'number.min': 'Age must be at least 12 years old',
        'number.max': 'Age must not exceed 120  years old',
        'any.required': 'Age is required',
    }),

    password: joi.string().trim().min(6).max(20).messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least six characters long',
        'string.max': 'Password must not exceed twenty characters',
    })
});

// Validate input on login
const validateUserLoginSchema = joi.object({
    username: joi.string().trim().max(15).messages({
        'string.base': 'Username must be a string',
        'string.max': 'Username must not exceed fifteen characters',
    }),

    email: joi.string().trim().email().lowercase().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
    }),

    password: joi.string().trim().required().messages({
        'string.base': 'Password must be a string',
        'any.required': 'Password is required',
    })
});

// Validate input on edit user details
const validateUserUpdateUserSchema = joi.object({
    username: joi.string().trim().min(2).max(15).messages({
        'string.base': 'Username must be a string',
        'string.min': 'Username must be at least two characters long',
        'string.max': 'Username must not exceed fifteen characters',
    }),

    email: joi.string().trim().email().lowercase().messages({
        'string.base': 'Email must be a string',
        'string.email': 'Invalid email format',
    }),

    name: joi.string().trim().min(2).max(30).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least two characters long',
        'string.max': 'Name must not exceed thirty characters',
    }),

    age: joi.number().integer().min(12).max(120).messages({
        'number.base': 'Age must be a number',
        'number.integer': 'Age must be an integer number',
        'number.min': 'Age must be at least 12 years old',
        'number.max': 'Age must not exceed 120 years old',
    }),

    password: joi.string().trim().min(6).max(20).messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least six characters long',
        'string.max': 'Password must not exceed twenty characters',
    })
});

// Validate input on create, update meme
const validateMemeSchema = joi.object({
    name: joi.string().trim().min(2).max(30).required().messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least two characters long',
        'string.max': 'Name must not exceed fifty characters',
        'any.required': 'Name is required'
    }),

    imageUrl: joi.string().trim().regex(/^https?:\/\/.+/).messages({
        'string.base': 'Image URL must be a string',
        'string.pattern.base': 'Image URL must start with http:// or https://',
    }),

    category: joi.string().valid(...category).messages({
        'string.base': 'Category must be a string',
        'any.required': 'Category is required',
        'any.only': '{#label} is not supported. Supported values are: ' + category.join(', ')
    })

});

const validateCommentSchema = joi.object({
    comment: joi.string().trim().required().max(300).messages({
        'string.base': 'Comment must be a string',
        'any.required': 'Comment is required',
        'string.max': 'Comment must be be a maximum of three hundred characters long'
    })
});

module.exports = {
    validateUserRegistrationSchema,
    validateUserLoginSchema,
    validateUserUpdateUserSchema,
    validateMemeSchema,
    validateCommentSchema,
};