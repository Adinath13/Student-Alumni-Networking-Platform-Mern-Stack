const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkChatAccess } = require('../middleware/chatAccessMiddleware');
const {
    createMentorshipRequest,
    getMentorshipRequests,
    updateMentorshipStatus,
    addMeeting,
    getAvailableMentors,
    getMyMentees,
    getMyMentor,
    rateMentor,
    completeMentorship
} = require('../controllers/mentorshipController');

router.post('/', protect, createMentorshipRequest);
router.get('/', protect, getMentorshipRequests);
router.get('/mentors', protect, getAvailableMentors);
router.get('/my-mentees', protect, getMyMentees);
router.get('/my-mentor', protect, getMyMentor);
router.put('/:id/status', protect, updateMentorshipStatus);
router.put('/:id/complete', protect, completeMentorship);
router.put('/:id/rate', protect, rateMentor);
router.get('/can-chat/:userId', protect, checkChatAccess);
router.post('/:id/meetings', protect, addMeeting);

module.exports = router;
