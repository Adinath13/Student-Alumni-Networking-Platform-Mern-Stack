const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Approve/Activate user
// @route   PUT /api/users/:id/approve
// @access  Private (Admin)
const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { suspended: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User approved successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Suspend user
// @route   PUT /api/users/:id/suspend
// @access  Private (Admin)
const suspendUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { suspended: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User suspended successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    approveUser,
    suspendUser
};
