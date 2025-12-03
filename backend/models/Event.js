const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location (or URL)'],
    },
    type: {
        type: String,
        enum: ['webinar', 'workshop', 'meetup', 'reunion', 'other'],
        default: 'webinar',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    bannerUrl: {
        type: String,
        default: 'https://placehold.co/800x400?text=Event+Banner',
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
