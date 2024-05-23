// config/config.js
import dotenv from 'dotenv';

dotenv.config();

const config = {
    SECRET_KEY: process.env.SECRET_KEY || 'default_secret_key', // Provide a default value for safety
};

export default config;
