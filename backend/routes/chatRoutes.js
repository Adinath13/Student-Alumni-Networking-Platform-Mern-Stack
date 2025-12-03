const express = require('express');
const router = express.Router();
const {
    getConversations,
    createOrGetConversation,
    sendMessage,
    getMessages,
    markMessageAsSeen,
    getUsersForMessaging
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/users', protect, getUsersForMessaging);
router.post('/conversation', protect, createOrGetConversation);
router.post('/message', protect, sendMessage);
router.get('/messages/:conversationId', protect, getMessages);
router.put('/message/:messageId/seen', protect, markMessageAsSeen);

module.exports = router;
