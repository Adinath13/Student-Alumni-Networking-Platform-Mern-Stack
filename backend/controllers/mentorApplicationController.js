const MentorApplication = require('../models/MentorApplication');
const User = require('../models/User');

// @desc    Submit mentor application (Alumni only)
// @route   POST /api/mentor-applications
// @access  Private (Alumni)
exports.submitMentorApplication = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        // Check if user is alumni
        if (req.user.role !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can apply to become mentors' });
        }

        // Check if application already exists
        const existingApplication = await MentorApplication.findOne({ user: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: 'You have already submitted a mentor application',
                application: existingApplication
            });
        }

        const {
            domain,
            experience,
            currentRole,
            currentCompany,
            linkedin,
            portfolio,
            availability,
            bio
        } = req.body;

        // Validate required fields
        if (!domain || !experience || !currentRole || !currentCompany || !linkedin || !availability || !bio) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        const application = await MentorApplication.create({
            user: userId,
            domain,
            experience,
            currentRole,
            currentCompany,
            linkedin,
            portfolio,
            availability,
            bio
        });

        await application.populate('user', 'name email');

        res.status(201).json({
            message: 'Mentor application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Mentor application error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all mentor applications (Admin only)
// @route   GET /api/mentor-applications
// @access  Private (Admin)
exports.getMentorApplications = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Only admins and TPOs can view all applications' });
        }

        const { status } = req.query;
        const filter = status ? { status } : {};

        const applications = await MentorApplication.find(filter)
            .populate('user', 'name email')
            .populate('approvedBy', 'name')
            .sort('-createdAt');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my mentor application (Alumni only)
// @route   GET /api/mentor-applications/me
// @access  Private (Alumni)
exports.getMyMentorApplication = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const application = await MentorApplication.findOne({ user: userId })
            .populate('user', 'name email')
            .populate('approvedBy', 'name');

        if (!application) {
            return res.status(404).json({ message: 'No mentor application found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve mentor application (Admin only)
// @route   PUT /api/mentor-applications/:id/approve
// @access  Private (Admin)
exports.approveMentorApplication = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Only admins and TPOs can approve applications' });
        }

        const application = await MentorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({
                message: `Application is already ${application.status}`
            });
        }

        application.status = 'approved';
        application.approvedBy = req.user.id || req.user._id;
        application.approvedAt = new Date();

        await application.save();
        await application.populate('user', 'name email');
        await application.populate('approvedBy', 'name');

        res.json({
            message: 'Mentor application approved successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject mentor application (Admin only)
// @route   PUT /api/mentor-applications/:id/reject
// @access  Private (Admin)
exports.rejectMentorApplication = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Only admins and TPOs can reject applications' });
        }

        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: 'Please provide a rejection reason' });
        }

        const application = await MentorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({
                message: `Application is already ${application.status}`
            });
        }

        application.status = 'rejected';
        application.rejectionReason = reason;

        await application.save();
        await application.populate('user', 'name email');

        res.json({
            message: 'Mentor application rejected',
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update mentor profile (Alumni only)
// @route   PUT /api/mentor-applications/:id
// @access  Private (Alumni)
exports.updateMentorProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const application = await MentorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user owns this application
        if (application.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        const {
            domain,
            experience,
            currentRole,
            currentCompany,
            linkedin,
            portfolio,
            availability,
            bio
        } = req.body;

        // Update fields
        if (domain) application.domain = domain;
        if (experience) application.experience = experience;
        if (currentRole) application.currentRole = currentRole;
        if (currentCompany) application.currentCompany = currentCompany;
        if (linkedin) application.linkedin = linkedin;
        if (portfolio !== undefined) application.portfolio = portfolio;
        if (availability) application.availability = availability;
        if (bio) application.bio = bio;

        await application.save();
        await application.populate('user', 'name email');

        res.json({
            message: 'Mentor profile updated successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Suspend mentor (Admin only)
// @route   PUT /api/mentor-applications/:id/suspend
// @access  Private (Admin)
exports.suspendMentor = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Only admins and TPOs can suspend mentors' });
        }

        const { reason } = req.body;

        const application = await MentorApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.status !== 'approved') {
            return res.status(400).json({
                message: 'Can only suspend approved mentors'
            });
        }

        application.status = 'suspended';
        application.rejectionReason = reason || 'Suspended by admin';

        await application.save();
        await application.populate('user', 'name email');

        res.json({
            message: 'Mentor suspended successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get verified mentors (Students/Alumni)
// @route   GET /api/mentors
// @access  Private
exports.getVerifiedMentors = async (req, res) => {
    try {
        const { domain, search } = req.query;

        const filter = { status: 'approved' };

        if (domain) {
            filter.domain = domain;
        }

        let mentors = await MentorApplication.find(filter)
            .populate('user', 'name email')
            .sort('-rating -totalRatings');

        // Search by name or company
        if (search) {
            const searchLower = search.toLowerCase();
            mentors = mentors.filter(mentor =>
                mentor.user?.name?.toLowerCase().includes(searchLower) ||
                mentor.currentCompany?.toLowerCase().includes(searchLower) ||
                mentor.currentRole?.toLowerCase().includes(searchLower)
            );
        }

        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get mentor profile by ID
// @route   GET /api/mentors/:id
// @access  Private
exports.getMentorProfile = async (req, res) => {
    try {
        const mentor = await MentorApplication.findById(req.params.id)
            .populate('user', 'name email');

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        if (mentor.status !== 'approved') {
            return res.status(403).json({ message: 'This mentor is not verified' });
        }

        res.json(mentor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get mentorship statistics (Admin only)
// @route   GET /api/mentor-applications/stats
// @access  Private (Admin)
exports.getMentorshipStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Only admins and TPOs can view statistics' });
        }

        const [pending, approved, rejected, suspended] = await Promise.all([
            MentorApplication.countDocuments({ status: 'pending' }),
            MentorApplication.countDocuments({ status: 'approved' }),
            MentorApplication.countDocuments({ status: 'rejected' }),
            MentorApplication.countDocuments({ status: 'suspended' })
        ]);

        const totalMentorships = await MentorApplication.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$totalMentees' } } }
        ]);

        const activeMentorships = await MentorApplication.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$activeMentees' } } }
        ]);

        res.json({
            applications: {
                pending,
                approved,
                rejected,
                suspended,
                total: pending + approved + rejected + suspended
            },
            mentorships: {
                total: totalMentorships[0]?.total || 0,
                active: activeMentorships[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
