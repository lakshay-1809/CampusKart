const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    requests: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'request' }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);
