const Mentorship = require('../models/Mentorship');
const User = require('../models/User');

/**
 * Middleware to check if two users can chat with each other
 * Rules:
 * - Admin: NO chat access at all
 * - Students: Can chat with accepted mentors + other students
 * - TPO: Can chat with alumni only
 * - Alumni (mentors): Can chat with accepted mentees + TPO
 */
const canChat = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const otherUserId = req.body.recipientId || req.params.userId || req.body.participants?.find(id => id !== currentUser._id.toString());

        if (!otherUserId) {
            return res.status(400).json({ message: 'Recipient user ID is required' });
        }

        // Block all admin chat access
        if (currentUser.role === 'admin') {
            return res.status(403).json({
                message: 'Administrators do not have chat access',
                canChat: false
            });
        }

        // Get the other user
        const otherUser = await User.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Block chat with admin
        if (otherUser.role === 'admin') {
            return res.status(403).json({
                message: 'Cannot chat with administrators',
                canChat: false
            });
        }

        // TPO can only chat with alumni
        if (currentUser.role === 'tpo') {
            if (otherUser.role !== 'alumni') {
                return res.status(403).json({
                    message: 'TPO can only chat with alumni',
                    canChat: false
                });
            }
            return next();
        }

        // Alumni (TPO chat already handled above)
        if (currentUser.role === 'alumni') {
            // Can chat with TPO
            if (otherUser.role === 'tpo') {
                return next();
            }

            // Can chat with accepted mentees (students)
            if (otherUser.role === 'student') {
                const mentorship = await Mentorship.findOne({
                    mentor: currentUser._id,
                    student: otherUserId,
                    status: { $in: ['accepted', 'active', 'completed'] }
                });

                if (mentorship) {
                    return next();
                }

                return res.status(403).json({
                    message: 'You can only chat with students who have accepted your mentorship',
                    canChat: false
                });
            }

            return res.status(403).json({
                message: 'Alumni can only chat with TPO and their accepted mentees',
                canChat: false
            });
        }

        // Students
        if (currentUser.role === 'student') {
            // Can chat with other students
            if (otherUser.role === 'student') {
                return next();
            }

            // Can chat with accepted mentors (alumni)
            if (otherUser.role === 'alumni') {
                const mentorship = await Mentorship.findOne({
                    mentor: otherUserId,
                    student: currentUser._id,
                    status: { $in: ['accepted', 'active', 'completed'] }
                });

                if (mentorship) {
                    return next();
                }

                return res.status(403).json({
                    message: 'You can only chat with mentors who have accepted your mentorship request',
                    canChat: false
                });
            }

            return res.status(403).json({
                message: 'Students can only chat with other students and their accepted mentors',
                canChat: false
            });
        }

        // Default deny
        return res.status(403).json({
            message: 'Chat access denied',
            canChat: false
        });

    } catch (error) {
        console.error('Chat access check error:', error);
        return res.status(500).json({ message: 'Error checking chat access' });
    }
};

/**
 * Check if current user can chat with specified user (GET endpoint)
 */
const checkChatAccess = async (req, res) => {
    try {
        const currentUser = req.user;
        const otherUserId = req.params.userId;

        // Admin has no chat access
        if (currentUser.role === 'admin') {
            return res.json({ canChat: false, reason: 'Administrators do not have chat access' });
        }

        const otherUser = await User.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cannot chat with admin
        if (otherUser.role === 'admin') {
            return res.json({ canChat: false, reason: 'Cannot chat with administrators' });
        }

        // TPO can only chat with alumni
        if (currentUser.role === 'tpo') {
            if (otherUser.role === 'alumni') {
                return res.json({ canChat: true });
            }
            return res.json({ canChat: false, reason: 'TPO can only chat with alumni' });
        }

        // Alumni
        if (currentUser.role === 'alumni') {
            // Can chat with TPO
            if (otherUser.role === 'tpo') {
                return res.json({ canChat: true });
            }

            // Can chat with accepted mentees
            if (otherUser.role === 'student') {
                const mentorship = await Mentorship.findOne({
                    mentor: currentUser._id,
                    student: otherUserId,
                    status: { $in: ['accepted', 'active', 'completed'] }
                });

                if (mentorship) {
                    return res.json({ canChat: true });
                }
                return res.json({ canChat: false, reason: 'You can only chat with students who have accepted your mentorship' });
            }

            return res.json({ canChat: false, reason: 'Alumni can only chat with TPO and their accepted mentees' });
        }

        // Students
        if (currentUser.role === 'student') {
            // Can chat with other students
            if (otherUser.role === 'student') {
                return res.json({ canChat: true });
            }

            // Can chat with accepted mentors
            if (otherUser.role === 'alumni') {
                const mentorship = await Mentorship.findOne({
                    mentor: otherUserId,
                    student: currentUser._id,
                    status: { $in: ['accepted', 'active', 'completed'] }
                });

                if (mentorship) {
                    return res.json({ canChat: true });
                }
                return res.json({ canChat: false, reason: 'You can only chat with mentors who have accepted your mentorship request' });
            }

            return res.json({ canChat: false, reason: 'Students can only chat with other students and their accepted mentors' });
        }

        return res.json({ canChat: false, reason: 'Chat access denied' });

    } catch (error) {
        console.error('Check chat access error:', error);
        return res.status(500).json({ message: 'Error checking chat access' });
    }
};

module.exports = { canChat, checkChatAccess };
