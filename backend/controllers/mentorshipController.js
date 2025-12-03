const Mentorship = require('../models/Mentorship');
const MentorApplication = require('../models/MentorApplication');
const User = require('../models/User');

// Create mentorship request
exports.createMentorshipRequest = async (req, res) => {
    try {
        const { mentorId, areaOfExpertise, requestMessage, studentGoals, description } = req.body;

        // Validate required fields
        if (!mentorId || !areaOfExpertise || !requestMessage || !studentGoals || !description) {
            return res.status(400).json({
                message: 'Please provide mentorId, areaOfExpertise, requestMessage, studentGoals, and description'
            });
        }

        // Check if mentor exists and is verified
        const mentorApplication = await MentorApplication.findOne({
            user: mentorId,
            status: 'approved'
        });

        if (!mentorApplication) {
            return res.status(400).json({ message: 'This mentor is not verified or does not exist' });
        }

        // Check if student already has a pending/active request with this mentor
        const existingRequest = await Mentorship.findOne({
            mentor: mentorId,
            student: req.user.id || req.user._id,
            status: { $in: ['pending', 'accepted', 'active'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'You already have an active or pending request with this mentor'
            });
        }

        const mentorship = await Mentorship.create({
            mentor: mentorId,
            student: req.user.id || req.user._id,
            areaOfExpertise,
            requestMessage,
            studentGoals,
            description
        });

        await mentorship.populate('mentor student', 'name email');

        res.status(201).json({
            message: 'Mentorship request sent successfully',
            mentorship
        });
    } catch (error) {
        console.error('Mentorship creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all mentorship requests (for mentors, students, admin, and TPO)
exports.getMentorshipRequests = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        let query = {};

        if (req.user.role === 'alumni') {
            query = { mentor: userId };
        } else if (req.user.role === 'student') {
            query = { student: userId };
        }
        // Admin and TPO will see all requests (query remains empty)

        const mentorships = await Mentorship.find(query)
            .populate('mentor student', 'name email')
            .sort('-createdAt');

        // Populate LinkedIn for mentors if the user is a student
        if (req.user.role === 'student') {
            const populatedMentorships = await Promise.all(mentorships.map(async (m) => {
                const mObj = m.toObject();
                const mentorApp = await MentorApplication.findOne({ user: m.mentor._id });
                if (mentorApp) {
                    mObj.mentor.linkedin = mentorApp.linkedin;
                }
                return mObj;
            }));
            return res.json(populatedMentorships);
        }

        res.json(mentorships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update mentorship status (Accept/Reject by mentor)
exports.updateMentorshipStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const mentorship = await Mentorship.findById(req.params.id);

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }

        const userId = req.user.id || req.user._id;
        // Only mentor can accept/reject
        if (mentorship.mentor.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (mentorship.status !== 'pending') {
            return res.status(400).json({
                message: `This request is already ${mentorship.status}`
            });
        }

        mentorship.status = status;

        if (status === 'accepted') {
            mentorship.startDate = new Date();
            mentorship.status = 'active';

            // Update mentor's active mentees count
            await MentorApplication.findOneAndUpdate(
                { user: userId },
                {
                    $inc: { activeMentees: 1, totalMentees: 1 }
                }
            );
        } else if (status === 'rejected' && rejectionReason) {
            mentorship.rejectionReason = rejectionReason;
        }

        await mentorship.save();
        await mentorship.populate('mentor student', 'name email');

        res.json({
            message: `Mentorship request ${status}`,
            mentorship
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add meeting to mentorship
exports.addMeeting = async (req, res) => {
    try {
        const { date, topic, notes } = req.body;
        const mentorship = await Mentorship.findById(req.params.id);

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }

        const userId = req.user.id || req.user._id;

        // Only mentor or student can add meetings
        if (mentorship.mentor.toString() !== userId.toString() &&
            mentorship.student.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        mentorship.meetingSchedule.push({ date, topic, notes });
        await mentorship.save();

        res.json({
            message: 'Meeting added successfully',
            mentorship
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all available mentors (verified only)
exports.getAvailableMentors = async (req, res) => {
    try {
        const mentors = await MentorApplication.find({ status: 'approved' })
            .populate('user', 'name email')
            .limit(50);

        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get mentor's mentees
exports.getMyMentees = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        if (req.user.role !== 'alumni') {
            return res.status(403).json({ message: 'Only alumni can view mentees' });
        }

        const mentees = await Mentorship.find({
            mentor: userId,
            status: { $in: ['active', 'completed'] }
        })
            .populate('student', 'name email')
            .sort('-createdAt');

        res.json(mentees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get student's mentor
exports.getMyMentor = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can view their mentor' });
        }

        const mentorship = await Mentorship.findOne({
            student: userId,
            status: { $in: ['active', 'completed'] }
        })
            .populate('mentor', 'name email')
            .sort('-createdAt');

        if (!mentorship) {
            return res.status(404).json({ message: 'No active mentor found' });
        }

        // Fetch mentor application to get LinkedIn
        const mentorApp = await MentorApplication.findOne({ user: mentorship.mentor._id });
        const mentorshipObj = mentorship.toObject();

        if (mentorApp) {
            mentorshipObj.mentor.linkedin = mentorApp.linkedin;
        }

        res.json(mentorshipObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rate mentor (Student only)
exports.rateMentor = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const mentorship = await Mentorship.findById(req.params.id);

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }

        const userId = req.user.id || req.user._id;

        // Only student can rate
        if (mentorship.student.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Can only rate completed mentorships
        if (mentorship.status !== 'completed') {
            return res.status(400).json({
                message: 'Can only rate completed mentorships'
            });
        }

        // Check if already rated
        if (mentorship.rating) {
            return res.status(400).json({ message: 'You have already rated this mentor' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        mentorship.rating = rating;
        mentorship.feedback = feedback;
        await mentorship.save();

        // Update mentor's average rating
        const mentorApplication = await MentorApplication.findOne({ user: mentorship.mentor });
        if (mentorApplication) {
            const totalRatings = mentorApplication.totalRatings + 1;
            const newRating = ((mentorApplication.rating * mentorApplication.totalRatings) + rating) / totalRatings;

            mentorApplication.rating = newRating;
            mentorApplication.totalRatings = totalRatings;
            await mentorApplication.save();
        }

        res.json({
            message: 'Rating submitted successfully',
            mentorship
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete mentorship
exports.completeMentorship = async (req, res) => {
    try {
        const mentorship = await Mentorship.findById(req.params.id);

        if (!mentorship) {
            return res.status(404).json({ message: 'Mentorship not found' });
        }

        const userId = req.user.id || req.user._id;

        // Only mentor can mark as complete
        if (mentorship.mentor.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (mentorship.status !== 'active') {
            return res.status(400).json({
                message: 'Can only complete active mentorships'
            });
        }

        mentorship.status = 'completed';
        mentorship.endDate = new Date();
        await mentorship.save();

        // Update mentor's active mentees count
        await MentorApplication.findOneAndUpdate(
            { user: userId },
            { $inc: { activeMentees: -1 } }
        );

        res.json({
            message: 'Mentorship marked as completed',
            mentorship
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

