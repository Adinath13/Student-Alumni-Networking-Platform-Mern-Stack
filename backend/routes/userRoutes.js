const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, approveUser, suspendUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.put('/:id/approve', approveUser);
router.put('/:id/suspend', suspendUser);
router.delete('/:id', deleteUser);

module.exports = router;
