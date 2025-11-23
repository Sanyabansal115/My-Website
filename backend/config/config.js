/**
 * Backend Configuration
 * 
 * Configuration settings for the Portfolio backend application.
 * Includes database connection, JWT settings, and environment variables.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'sanya_portfolio_jwt_secret_key_2025_secure',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    mongoUri: process.env.MONGODB_URI || 
        'mongodb+srv://sanyabansal115_db_user:Sbhargav2005@cluster0.xebgb5i.mongodb.net/Portfolio?retryWrites=true&w=majority&appName=Cluster0',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

export default config;