const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const AppError = require('../utils/AppError');

// @desc    Mark lesson as complete
// @route   POST /api/progress/complete
exports.completeLesson = async (req, res, next) => {
  try {
    const { lessonId, courseId, watchTime } = req.body;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return next(new AppError('You are not enrolled in this course.', 403));
    }

    let progress = await Progress.findOne({
      student: req.user._id,
      lesson: lessonId,
    });

    if (progress) {
      progress.completed = true;
      progress.watchTime = watchTime || progress.watchTime;
      progress.completedAt = new Date();
      await progress.save();
    } else {
      progress = await Progress.create({
        student: req.user._id,
        lesson: lessonId,
        course: courseId,
        completed: true,
        watchTime: watchTime || 0,
        completedAt: new Date(),
      });
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress for a course
// @route   GET /api/progress/course/:courseId
exports.getCourseProgress = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const progress = await Progress.find({
      student: req.user._id,
      course: courseId,
    });

    const course = await Course.findById(courseId).populate({
      path: 'modules',
      populate: { path: 'lessons' },
    });

    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    const totalLessons = course.modules.reduce(
      (acc, mod) => acc + mod.lessons.length, 0
    );
    const completedLessons = progress.filter((p) => p.completed).length;
    const totalWatchTime = progress.reduce((acc, p) => acc + p.watchTime, 0);

    res.status(200).json({
      success: true,
      progress: progress,
      stats: {
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        totalWatchTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall learning stats
// @route   GET /api/progress/stats
exports.getStats = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.countDocuments({ student: req.user._id });
    const completedLessons = await Progress.countDocuments({
      student: req.user._id,
      completed: true,
    });
    const totalWatchTime = await Progress.aggregate([
      { $match: { student: req.user._id } },
      { $group: { _id: null, total: { $sum: '$watchTime' } } },
    ]);

    const completedCourses = await Enrollment.countDocuments({
      student: req.user._id,
      status: 'completed',
    });

    res.status(200).json({
      success: true,
      stats: {
        enrolledCourses: enrollments,
        completedLessons,
        completedCourses,
        totalWatchTime: totalWatchTime[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
