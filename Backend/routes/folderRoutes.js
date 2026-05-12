const express = require('express');
const router = express.Router();
const { getFolders, createFolder, deleteFolder } = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFolders)
    .post(protect, createFolder);

router.route('/:id')
    .delete(protect, deleteFolder);

module.exports = router;
