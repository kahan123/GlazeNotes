const Note = require('../models/noteModel');

// @desc    Get notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ isPinned: -1, updatedAt: -1 });
    res.status(200).json(notes);
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    if (!req.body.title && !req.body.content) {
        return res.status(400).json({ message: 'Please add a title or content' });
    }

    const note = await Note.create({
        user: req.user.id,
        title: req.body.title || 'Untitled',
        content: req.body.content || '',
        contentPreview: req.body.contentPreview || '',
        tags: req.body.tags || [],
        isPinned: req.body.isPinned || false
    });

    res.status(200).json(note);
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedNote);
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};
