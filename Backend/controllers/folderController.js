const Folder = require('../models/folderModel');
const Note = require('../models/noteModel');

// @desc    Get folders
// @route   GET /api/folders
// @access  Private
const getFolders = async (req, res) => {
    const folders = await Folder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(folders);
};

// @desc    Create folder
// @route   POST /api/folders
// @access  Private
const createFolder = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'Please add a folder name' });
    }

    const folder = await Folder.create({
        user: req.user.id,
        name: req.body.name,
        color: req.body.color || '#4CE092'
    });

    res.status(201).json(folder);
};

// @desc    Delete folder
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = async (req, res) => {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
    }

    if (folder.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    // Set notes in this folder to null folder
    await Note.updateMany({ folder: req.params.id }, { folder: null });

    await folder.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getFolders,
    createFolder,
    deleteFolder
};
