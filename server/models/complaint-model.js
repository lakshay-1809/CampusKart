const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ['user-behavior', 'inappropriate-request', 'spam', 'fraud', 'other']
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'investigating', 'resolved', 'dismissed']
    },
    priority: {
        type: String,
        default: 'medium',
        enum: ['low', 'medium', 'high', 'urgent']
    },
    adminResponse: {
        type: String,
        default: null
    },
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for faster queries
complaintSchema.index({ status: 1 });
complaintSchema.index({ type: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);