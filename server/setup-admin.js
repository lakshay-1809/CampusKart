// Script to create the first admin account
// Run this file using: node setup-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminModel = require('./models/admin-model');
require('dotenv').config();

const setupAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        // Check if any admin exists
        const existingAdmin = await adminModel.findOne();
        if (existingAdmin) {
            console.log('❌ Admin already exists!');
            console.log('Username:', existingAdmin.username);
            console.log('Email:', existingAdmin.email);
            process.exit(1);
        }

        // Create default admin credentials
        const defaultCredentials = {
            username: 'admin',
            email: 'admin@campuskart.com',
            password: 'admin123',  // Change this in production!
            role: 'super-admin'
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(defaultCredentials.password, 10);

        // Create admin
        const admin = await adminModel.create({
            username: defaultCredentials.username,
            email: defaultCredentials.email,
            password: hashedPassword,
            role: defaultCredentials.role,
            permissions: {
                manageUsers: true,
                manageRequests: true,
                handleComplaints: true,
                viewAnalytics: true,
                systemSettings: true
            }
        });

        console.log('✅ Super admin created successfully!');
        console.log('-----------------------------------');
        console.log('Username:', defaultCredentials.username);
        console.log('Email:', defaultCredentials.email);
        console.log('Password:', defaultCredentials.password);
        console.log('Role:', defaultCredentials.role);
        console.log('-----------------------------------');
        console.log('⚠️  IMPORTANT: Change the default password immediately!');
        console.log('🔗 Access admin panel at: http://localhost:5173/admin/login');

    } catch (error) {
        console.error('❌ Error setting up admin:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

setupAdmin();