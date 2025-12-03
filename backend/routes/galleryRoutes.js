const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createGallery,
    getGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery,
    addImages
} = require('../controllers/galleryController');

router.post('/', protect, createGallery);
router.get('/', getGalleries);
router.get('/:id', getGalleryById);
router.put('/:id', protect, updateGallery);
router.delete('/:id', protect, deleteGallery);
router.post('/:id/images', protect, addImages);

module.exports = router;
