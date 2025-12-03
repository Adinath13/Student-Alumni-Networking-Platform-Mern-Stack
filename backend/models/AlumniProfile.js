const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    batch: {
        type: Number,
        required: [true, 'Please add your graduation year'],
    },
    degree: {
        type: String,
        required: [true, 'Please add your degree'],
    },
    branch: {
        type: String,
        required: [true, 'Please add your branch/major'],
    },
    currentCompany: {
        type: String,
    },
    designation: {
        type: String,
    },
    skills: {
        type: [String],
        default: [],
    },
    linkedin: {
        type: String,
    },
    github: {
        type: String,
    },
    about: {
        type: String,
    },
    experience: [
        {
            company: String,
            role: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String,
        }
    ],
    education: [
        {
            institution: String,
            degree: String,
            year: Number,
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);
