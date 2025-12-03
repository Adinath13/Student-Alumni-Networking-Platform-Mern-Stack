const mongoose = require('mongoose');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const User = require('./models/User');
require('dotenv').config();

async function createTestConversation() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const student = await User.findOne({ email: 'teststudent@test.com' });
        const alumni = await User.findOne({ email: 'testalumni@test.com' });

        if (!student || !alumni) {
            console.log('Users not found');
            process.exit(1);
        }

        console.log('Found users:');
        console.log('Student ID:', student._id);
        console.log('Alumni ID:', alumni._id);

        let conv = await Conversation.findOne({
            participants: { $all: [student._id, alumni._id] }
        });

        if (!conv) {
            conv = await Conversation.create({
                participants: [student._id, alumni._id]
            });
            await conv.populate('participants', 'name email role');
            console.log('Created conversation:', conv._id);
        } else {
            console.log('Conversation already exists:', conv._id);
        }

        const msg = await Message.create({
            conversationId: conv._id,
            sender: alumni._id,
            text: 'Hello Test Student! This is a test message from Test Alumni.'
        });

        conv.lastMessage = msg._id;
        conv.updatedAt = Date.now();
        await conv.save();

        console.log('Created message:', msg._id);
        console.log('Success! Conversation and message created.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestConversation();
