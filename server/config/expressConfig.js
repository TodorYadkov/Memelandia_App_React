const express = require('express');
const addCORS = require('../middlewares/addCORS');
const userSession = require('../middlewares/userSession');

module.exports = (app) => {

    // Add CORS
    app.use(addCORS());
    // Add middleware to use JSON
    app.use(express.json({ limit: '10mb' }));
    // Add middleware to get data from body and from query
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    // Check user token
    app.use(userSession());

};