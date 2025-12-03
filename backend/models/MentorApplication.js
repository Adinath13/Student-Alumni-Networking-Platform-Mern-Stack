const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    domain: {
        type: [String],
        required: [true, 'Please specify your areas of expertise'],
        enum: [
            'AI/ML',
            'Web Development',
            'Mobile Development',
            'Cloud Computing',
            'Cybersecurity',
            'Data Science',
            'DevOps',
            'Blockchain',
            'UI/UX Design',
            'Product Management',
            'Career Guidance',
            'Interview Preparation',
            'Resume Building',
            'Other'
        ]
    },
    experience: {
        years: {
            type: Number,
            required: [true, 'Please specify years of experience']
        },
        description: {
            type: String,
            required: [true, 'Please describe your experience']
        }
    },
    currentRole: {
        type: String,
        required: [true, 'Please specify your current role']
    },
    currentCompany: {
        type: String,
        required: [true, 'Please specify your current company']
    },
    linkedin: {
        type: String,
        required: [true, 'Please provide your LinkedIn profile'],
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please provide a valid LinkedIn URL']
    },
    portfolio: {
        type: String,
        match: [/^https?:\/\/.*$/, 'Please provide a valid URL']
    },
    availability: {
        hoursPerWeek: {
            type: Number,
            required: [true, 'Please specify your availability'],
            min: 1,
            max: 20
        },
        preferredDays: {
            type: [String],
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
    },
    bio: {
        type: String,
        required: [true, 'Please provide a bio describing what you can help with'],
        minlength: 50,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalMentees: {
        type: Number,
        default: 0
    },
    activeMentees: {
        type: Number,
        default: 0
    },
    maxMentees: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

// Index for faster queries
mentorApplicationSchema.index({ user: 1, status: 1 });
mentorApplicationSchema.index({ status: 1 });
mentorApplicationSchema.index({ domain: 1 });

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema);
