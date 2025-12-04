const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        console.log('📝 Registration attempt:', { email: req.body.email, role: req.body.role });

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            console.log('❌ Registration failed: Missing fields');
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('❌ Registration failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        if (user) {
            console.log('✅ User registered successfully:', { id: user._id, email: user.email, role: user.role });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('❌ Registration failed: Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('❌ Registration error:');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        console.log('🔐 Login attempt:', { email: req.body.email });

        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ Login failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.matchPassword(password);

        if (user && isPasswordMatch) {
            console.log('✅ Login successful:', { id: user._id, email: user.email, role: user.role });
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('❌ Login failed: Invalid password');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('❌ Login error:');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        res.status(500).json({
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
