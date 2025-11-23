/**
 * Server.js - Main Express Server for Portfolio Application
 * 
 * This is the main server file that sets up the Express application,
 * connects to MongoDB, and configures all middleware and routes.
 * 
 * Features:
 * - JWT Authentication
 * - MongoDB integration with Mongoose
 * - CORS enabled for frontend communication
 * - Role-based access control (User/Admin)
 * - CRUD operations for Contact, Education, and Projects
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

// Import routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import educationRoutes from './routes/education.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/user.js';

const app = express();
const PORT = config.port;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
});