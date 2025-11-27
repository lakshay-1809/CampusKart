const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'completed', 'cancelled', 'accepted']
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'general'
    },
    location: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('request', requestSchema);
