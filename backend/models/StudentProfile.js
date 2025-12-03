const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    batch: {
        type: Number,
        required: [true, 'Please add your expected graduation year'],
    },
    course: {
        type: String,
        required: [true, 'Please add your course'],
    },
    branch: {
        type: String,
        required: [true, 'Please add your branch'],
    },
    skills: {
        type: [String],
        default: [],
    },
    interests: {
        type: [String],
        default: [],
    },
    linkedin: {
        type: String,
    },
    github: {
        type: String,
    },
    resumeLink: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
