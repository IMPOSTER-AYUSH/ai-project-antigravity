const express = require('express');
const router = express.Router();
const { completeLesson, getCourseProgress, getStats } = require('../controllers/progressController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.post('/complete', protect, requireRole('student'), completeLesson);
router.get('/course/:courseId', protect, getCourseProgress);
router.get('/stats', protect, requireRole('student'), getStats);

module.exports = router;
