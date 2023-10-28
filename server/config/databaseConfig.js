const mongoose = require('mongoose');

module.exports = async (CONNECTION_STRING) => {
    try {
        // Connect with DB
        mongoose.connect(CONNECTION_STRING);

        console.log('Database is successfully connected')
        
    } catch (error) {

        console.log('Error to initialize database!')
        console.error(error.message);
        process.exit(1);
    }
}