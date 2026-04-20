const express = require('express');
const router = express.Router();
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
  createModule,
  updateModule,
  deleteModule,
} = require('../controllers/lessonController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Modules
router.post('/modules', protect, requireRole('teacher', 'admin'), createModule);
router.put('/modules/:id', protect, requireRole('teacher', 'admin'), updateModule);
router.delete('/modules/:id', protect, requireRole('teacher', 'admin'), deleteModule);

// Lessons
router.post('/', protect, requireRole('teacher', 'admin'), createLesson);
router.get('/:id', protect, getLesson);
router.put('/:id', protect, requireRole('teacher', 'admin'), updateLesson);
router.delete('/:id', protect, requireRole('teacher', 'admin'), deleteLesson);

module.exports = router;
