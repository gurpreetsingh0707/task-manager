const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' }
    }],
    deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);