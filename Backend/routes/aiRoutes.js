const express = require('express');
const router = express.Router();
const { getChatHistory, chatAI, clearChatHistory, summarizeNote } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.route('/chat/:noteId')
    .get(protect, getChatHistory)
    .post(protect, chatAI)
    .delete(protect, clearChatHistory);

router.post('/summarize', protect, summarizeNote);

module.exports = router;
