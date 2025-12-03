const express = require('express');
const router = express.Router();
const {
    getJobs,
    createJob,
    deleteJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getJobs);
router.post('/', protect, authorize('admin', 'alumni', 'tpo'), createJob);
router.delete('/:id', protect, authorize('admin', 'alumni', 'tpo'), deleteJob);

module.exports = router;
