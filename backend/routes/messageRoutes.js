const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { canChat } = require('../middleware/chatAccessMiddleware');
const {
    sendMessage,
    getConversation,
    getConversations,
    markAsRead,
    getUnreadCount,
    getAllConversationsForAdmin,
    getConversationDetailsForAdmin
} = require('../controllers/messageController');

router.post('/', protect, canChat, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/admin/all-conversations', protect, getAllConversationsForAdmin);
router.get('/admin/conversation/:conversationId', protect, getConversationDetailsForAdmin);
router.get('/:userId', protect, canChat, getConversation);
router.put('/:messageId/read', protect, markAsRead);

module.exports = router;
