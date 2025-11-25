const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: false // Optional because of Google Auth
    },
    googleId: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
