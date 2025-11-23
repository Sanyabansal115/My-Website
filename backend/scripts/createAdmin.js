/**
 * Create Admin User Script
 * 
 * This script creates a hardcoded admin user in the MongoDB database
 * as required by the assignment specifications.
 * 
 * @author Sanya Bansal
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/config.js';

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@sanyaportfolio.com' });
        
        if (existingAdmin) {
            console.log('👤 Admin user already exists');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            return;
        }

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@sanyaportfolio.com',
            password: 'Admin@123456', // This will be hashed automatically by the User model
            role: 'admin',
            isActive: true,
            isEmailVerified: true
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@sanyaportfolio.com');
        console.log('🔐 Password: Admin@123456');
        console.log('🔑 Role: admin');
        console.log('');
        console.log('⚠️  IMPORTANT: Change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the script
createAdminUser();