const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'super-admin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    permissions: {
        manageUsers: {
            type: Boolean,
            default: true
        },
        manageRequests: {
            type: Boolean,
            default: true
        },
        handleComplaints: {
            type: Boolean,
            default: true
        },
        viewAnalytics: {
            type: Boolean,
            default: true
        },
        systemSettings: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Index for faster queries
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });

module.exports = mongoose.model('Admin', adminSchema);