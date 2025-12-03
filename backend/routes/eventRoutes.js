const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getEvents);
router.post('/', protect, authorize('admin', 'alumni', 'tpo'), createEvent);
router.delete('/:id', protect, authorize('admin', 'alumni', 'tpo'), deleteEvent);
router.put('/:id/register', protect, registerForEvent);

module.exports = router;
