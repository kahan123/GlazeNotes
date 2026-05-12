const express = require('express');
const router = express.Router();
const { getNotes, getNote, getPublicNote, createNote, updateNote, deleteNote, searchNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/search').get(protect, searchNotes);
router.route('/public/:id').get(getPublicNote);
router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').get(protect, getNote).put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
