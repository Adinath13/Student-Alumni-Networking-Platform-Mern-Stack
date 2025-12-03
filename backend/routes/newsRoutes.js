const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    getFeaturedNews
} = require('../controllers/newsController');

router.post('/', protect, authorize('admin', 'tpo'), createNews);
router.get('/', getAllNews);
router.get('/featured', getFeaturedNews);
router.get('/:id', getNewsById);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;
