const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@studentnetwork.com' });

        if (existingAdmin) {
            console.log('❌ Admin user already exists with email: admin@studentnetwork.com');
            console.log('📧 Email: admin@studentnetwork.com');
            console.log('ℹ️  If you forgot the password, delete this user from MongoDB Atlas and run this script again.');
            process.exit(1);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@studentnetwork.com',
            password: 'Admin@123',  // Change this to a secure password
            role: 'admin',
            isApproved: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@studentnetwork.com');
        console.log('🔑 Password: Admin@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
