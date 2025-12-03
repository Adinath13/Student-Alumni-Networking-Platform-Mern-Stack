const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content
        });

        await message.populate('sender receiver', 'name email');

        if (req.io) {
            req.io.to(receiverId).emit('receive_message', message);
            console.log(`Message emitted to receiver ${receiverId}`);
        } else {
            console.error('Socket.io instance not found in request');
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        })
            .populate('sender receiver', 'name email')
            .sort('createdAt');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', req.user._id] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        await Message.populate(messages, {
            path: 'lastMessage.sender lastMessage.receiver',
            select: 'name email'
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        message.read = true;
        message.readAt = new Date();
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user._id,
            read: false
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all conversations for admin/TPO (read-only view)
exports.getAllConversationsForAdmin = async (req, res) => {
    try {
        // Check if user is admin or TPO
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Access denied. Admin or TPO role required.' });
        }

        const conversations = await Message.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lt: ['$sender', '$receiver'] },
                            { user1: '$sender', user2: '$receiver' },
                            { user1: '$receiver', user2: '$sender' }
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' },
                    messageCount: { $sum: 1 },
                    updatedAt: { $first: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: {
                        $concat: [
                            { $toString: '$_id.user1' },
                            '_',
                            { $toString: '$_id.user2' }
                        ]
                    },
                    participants: ['$_id.user1', '$_id.user2'],
                    lastMessage: '$lastMessage',
                    messageCount: '$messageCount',
                    updatedAt: '$updatedAt'
                }
            }
        ]);

        // Populate participant details
        const User = require('../models/User');
        for (let conv of conversations) {
            const users = await User.find({ _id: { $in: conv.participants } })
                .select('name email role');
            conv.participants = users;
        }

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get conversation details for admin/TPO (read-only view)
exports.getConversationDetailsForAdmin = async (req, res) => {
    try {
        // Check if user is admin or TPO
        if (req.user.role !== 'admin' && req.user.role !== 'tpo') {
            return res.status(403).json({ message: 'Access denied. Admin or TPO role required.' });
        }

        const { conversationId } = req.params;

        // Parse the conversation ID (format: "senderId_receiverId")
        const [senderId, receiverId] = conversationId.split('_');

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: 'Invalid conversation ID format' });
        }

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .populate('sender receiver', 'name email role')
            .sort('createdAt');

        // Get participant details
        const User = require('../models/User');
        const participants = await User.find({ _id: { $in: [senderId, receiverId] } })
            .select('name email role');

        res.json({
            conversation: {
                _id: conversationId,
                participants: participants
            },
            messages: messages
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
