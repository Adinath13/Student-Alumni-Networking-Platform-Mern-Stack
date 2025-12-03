const StudentProfile = require('../models/StudentProfile');

// @desc    Create or Update Student Profile
// @route   POST /api/students
// @access  Private (Student only)
const updateStudentProfile = async (req, res) => {
    const {
        batch,
        course,
        branch,
        skills,
        interests,
        linkedin,
        github,
        resumeLink
    } = req.body;

    const profileFields = {
        user: req.user.id,
        batch,
        course,
        branch,
        skills,
        interests,
        linkedin,
        github,
        resumeLink
    };

    try {
        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await StudentProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            ).populate('user', ['name', 'email']);
            return res.json(profile);
        }

        // Create
        profile = new StudentProfile(profileFields);
        await profile.save();
        await profile.populate('user', ['name', 'email']);
        res.json(profile);
    } catch (err) {
        console.error('Error in updateStudentProfile:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error: ' + err.message);
    }
};

// @desc    Get current student profile
// @route   GET /api/students/me
// @access  Private
const getCurrentStudentProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
        if (!profile) {
            return res.json(null);
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin/Alumni/TPO)
const getAllStudents = async (req, res) => {
    try {
        const profiles = await StudentProfile.find().populate('user', ['name', 'email']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    updateStudentProfile,
    getCurrentStudentProfile,
    getAllStudents
};
