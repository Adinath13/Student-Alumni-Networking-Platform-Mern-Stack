const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'active', 'completed'],
        default: 'pending'
    },
    areaOfExpertise: {
        type: String,
        required: true
    },
    requestMessage: {
        type: String,
        required: true
    },
    studentGoals: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    meetingSchedule: [{
        date: Date,
        topic: String,
        notes: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
mentorshipSchema.index({ mentor: 1, status: 1 });
mentorshipSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model('Mentorship', mentorshipSchema);
