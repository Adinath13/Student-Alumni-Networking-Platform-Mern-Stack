const express = require('express');
const router = express.Router();
const {
    updateAlumniProfile,
    getCurrentAlumniProfile,
    getAllAlumni,
    getAlumniById
} = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getAllAlumni);
router.get('/me', protect, authorize('alumni'), getCurrentAlumniProfile);
router.get('/:id', getAlumniById);
router.put('/', protect, updateAlumniProfile);

module.exports = router;
