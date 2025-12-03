const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: './.env' }); // Adjust path if running from backend root

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        isApproved: true
    },
    {
        name: 'Alumni User',
        email: 'alumni@example.com',
        password: 'password123',
        role: 'alumni',
        isApproved: true
    },
    {
        name: 'Student User',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        isApproved: true
    },
    {
        name: 'TPO User',
        email: 'tpo@example.com',
        password: 'password123',
        role: 'tpo',
        isApproved: true
    }
];

const importData = async () => {
    try {
        await User.deleteMany();

        await User.create(users);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
