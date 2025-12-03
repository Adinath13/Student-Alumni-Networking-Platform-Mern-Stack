const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadImage, handleUpload } = require('../controllers/uploadController');

router.post('/', protect, uploadImage, handleUpload);

module.exports = router;
