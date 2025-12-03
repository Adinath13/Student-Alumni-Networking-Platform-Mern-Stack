const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    submitMentorApplication,
    getMentorApplications,
    getMyMentorApplication,
    approveMentorApplication,
    rejectMentorApplication,
    updateMentorProfile,
    suspendMentor,
    getVerifiedMentors,
    getMentorProfile,
    getMentorshipStats
} = require('../controllers/mentorApplicationController');

// Mentor application routes
router.post('/', protect, submitMentorApplication);
router.get('/', protect, getMentorApplications);
router.get('/stats', protect, getMentorshipStats);
router.get('/me', protect, getMyMentorApplication);
router.put('/:id', protect, updateMentorProfile);
router.put('/:id/approve', protect, approveMentorApplication);
router.put('/:id/reject', protect, rejectMentorApplication);
router.put('/:id/suspend', protect, suspendMentor);

// Verified mentors routes (for students/alumni to view)
router.get('/verified/all', protect, getVerifiedMentors);
router.get('/verified/:id', protect, getMentorProfile);

module.exports = router;
