const express = require('express');
const router = express.Router();
const { uploadImage, uploadVideo } = require('../controllers/uploadController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');

router.post('/image', protect, upload.single('file'), uploadImage);
router.post('/video', protect, requireRole('teacher', 'admin'), upload.single('file'), uploadVideo);

module.exports = router;
