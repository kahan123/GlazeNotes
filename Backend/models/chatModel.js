const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'ai']
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Note'
    },
    messages: [chatMessageSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
