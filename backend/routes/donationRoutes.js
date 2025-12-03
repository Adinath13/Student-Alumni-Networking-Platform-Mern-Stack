const express = require('express');
const router = express.Router();
const {
    getDonations,
    createDonation
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), getDonations);
router.post('/', protect, createDonation);

module.exports = router;
