const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure unique conversation between two participants
// This index might need adjustment if we want to support group chats later, but for 1-on-1 it's good.
// However, enforcing uniqueness on array is tricky in Mongo. 
// We will handle "get or create" logic in the controller.

module.exports = mongoose.model('Conversation', conversationSchema);
