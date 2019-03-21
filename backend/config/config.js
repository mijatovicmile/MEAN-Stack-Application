// Require and configure dotenv module, which loads environment variables from a .env file into process.env
require('dotenv').config(); 

const config = {
    port: process.env.PORT,
    mongo: {
        host: process.env.MONGO_ATLAS_HOST,
        user: process.env.MONGO_ATLAS_USER,
        password: process.env.MONGO_ATLAS_PASSWORD
    }   
};

// Exports the config module
module.exports = config;