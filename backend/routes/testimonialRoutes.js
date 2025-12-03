const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    getFeaturedTestimonials
} = require('../controllers/testimonialController');

router.post('/', protect, createTestimonial);
router.get('/', getAllTestimonials);
router.get('/featured', getFeaturedTestimonials);
router.get('/:id', getTestimonialById);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);
router.put('/:id/approve', protect, authorize('admin'), approveTestimonial);

module.exports = router;
