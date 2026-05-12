const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a folder name']
    },
    color: {
        type: String,
        default: '#4CE092' // Default accent color
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', folderSchema);
