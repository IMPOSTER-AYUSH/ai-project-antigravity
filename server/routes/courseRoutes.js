const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses,
  getEnrolledCourses,
  getAnalytics,
} = require('../controllers/courseController');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Public
router.get('/', getCourses);
router.get('/browse/:id', getCourse);

// Student
router.get('/enrolled', protect, requireRole('student'), getEnrolledCourses);
router.post('/:id/enroll', protect, requireRole('student'), enrollCourse);

// Teacher
router.get('/my-courses', protect, requireRole('teacher', 'admin'), getMyCourses);
router.get('/analytics', protect, requireRole('teacher', 'admin'), getAnalytics);
router.post('/', protect, requireRole('teacher', 'admin'), createCourse);
router.put('/:id', protect, requireRole('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, requireRole('teacher', 'admin'), deleteCourse);

// Authenticated (must be after static routes)
router.get('/:id', protect, getCourse);

module.exports = router;
