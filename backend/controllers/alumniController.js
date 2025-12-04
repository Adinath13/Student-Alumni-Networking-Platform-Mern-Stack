const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// @desc    Create or Update Alumni Profile
// @route   POST /api/alumni
// @access  Private (Alumni only)
const updateAlumniProfile = async (req, res) => {
    const {
        batch,
        degree,
        branch,
        currentCompany,
        designation,
        skills,
        linkedin,
        github,
        about,
        experience,
        education
    } = req.body;

    const profileFields = {
        user: req.user.id,
        batch,
        degree,
        branch,
        currentCompany,
        designation,
        skills,
        linkedin,
        github,
        about,
        experience,
        education
    };

    try {
        let profile = await AlumniProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await AlumniProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            ).populate('user', ['name', 'email']);
            return res.json(profile);
        }

        // Create
        profile = new AlumniProfile(profileFields);
        await profile.save();
        await profile.populate('user', ['name', 'email']);
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get current alumni profile
// @route   GET /api/alumni/me
// @access  Private
const getCurrentAlumniProfile = async (req, res) => {
    try {
        const profile = await AlumniProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role']);
        if (!profile) {
            return res.json(null);
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all alumni profiles
// @route   GET /api/alumni
// @access  Public
const getAllAlumni = async (req, res) => {
    try {
        console.log('📋 Fetching all alumni profiles...');

        const profiles = await AlumniProfile.find().populate('user', ['name', 'email']);

        console.log(`✅ Found ${profiles.length} alumni profiles`);

        if (profiles.length > 0) {
            console.log('   Sample profile:', {
                id: profiles[0]._id,
                userName: profiles[0].user?.name,
                company: profiles[0].currentCompany,
                hasUser: !!profiles[0].user
            });
        } else {
            console.log('⚠️  No alumni profiles found in database!');
        }

        res.json(profiles);
    } catch (err) {
        console.error('❌ Error fetching alumni profiles:');
        console.error(`   Message: ${err.message}`);
        console.error(`   Stack:`, err.stack);
        res.status(500).json({
            message: 'Server Error fetching alumni profiles',
            error: err.message
        });
    }
};

// @desc    Get alumni profile by ID
// @route   GET /api/alumni/:id
// @access  Public
const getAlumniById = async (req, res) => {
    try {
        const profile = await AlumniProfile.findById(req.params.id).populate('user', ['name', 'email']);
        if (!profile) return res.status(400).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ message: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    updateAlumniProfile,
    getCurrentAlumniProfile,
    getAllAlumni,
    getAlumniById
};
