const Donation = require('../models/Donation');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private (Admin)
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate('donor', 'name email');
        res.json(donations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Create donation record
// @route   POST /api/donations
// @access  Private
const createDonation = async (req, res) => {
    try {
        const { amount, purpose, paymentId } = req.body;
        const donation = await Donation.create({
            donor: req.user.id,
            amount,
            purpose,
            paymentId,
            status: 'completed' // Simulating immediate completion
        });
        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getDonations,
    createDonation
};
