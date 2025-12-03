const express = require('express');
const router = express.Router();
const {
    updateStudentProfile,
    getCurrentStudentProfile,
    getAllStudents
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getAllStudents);
router.get('/me', protect, getCurrentStudentProfile);
router.put('/', protect, updateStudentProfile);
router.put('/students', protect, updateStudentProfile);


module.exports = router;
