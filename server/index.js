const express = require('express');
const databaseConfig = require('./config/databaseConfig');
const expressConfig = require('./config/expressConfig');
const globalErrorHandler = require('./util/globalErrorHandler');
const routesConfig = require('./config/routesConfig');
require('dotenv').config();

(async function start() {
    // Get environment variables for the project
    const PORT = process.env.PORT || 3000;
    const CONNECTION_STRING = process.env.CONNECTION_STRING;

    // Initialize express
    const app = express();

    // Connect to DB
    await databaseConfig(CONNECTION_STRING);
    expressConfig(app);
    routesConfig(app);

    // Global error handler must be the last
    app.use(globalErrorHandler);

    // Run server
    app.listen(PORT, () => console.log(`Server is listen on port ${PORT}`));

})()