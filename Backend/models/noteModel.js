const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    contentPreview: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        default: []
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    embedding: {
        type: [Number],
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
}, {
    timestamps: true
});

noteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
