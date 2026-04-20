const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const AppError = require('../utils/AppError');

// @desc    Get all published courses
// @route   GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with modules and lessons
// @route   GET /api/courses/:id
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name avatar')
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
      });

    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      teacher: req.user._id,
    };

    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this course.', 403));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this course.', 403));
    }

    // Delete associated modules, lessons, enrollments, and progress
    const modules = await Module.find({ course: course._id });
    for (const mod of modules) {
      await Lesson.deleteMany({ module: mod._id });
    }
    await Module.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await Progress.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (existing) {
      return next(new AppError('Already enrolled in this course.', 400));
    }

    await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    course.enrolledCount += 1;
    await course.save();

    res.status(201).json({ success: true, message: 'Enrolled successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's own courses
// @route   GET /api/courses/my-courses
exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student enrolled courses
// @route   GET /api/courses/enrolled
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: [
          { path: 'teacher', select: 'name avatar' },
          {
            path: 'modules',
            options: { sort: { order: 1 } },
            populate: { path: 'lessons', options: { sort: { order: 1 } } },
          },
        ],
      })
      .sort({ createdAt: -1 });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (!enrollment.course) return null;
        const totalLessons = enrollment.course.modules.reduce(
          (acc, mod) => acc + mod.lessons.length, 0
        );
        const completedLessons = await Progress.countDocuments({
          student: req.user._id,
          course: enrollment.course._id,
          completed: true,
        });
        return {
          ...enrollment.toObject(),
          progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          totalLessons,
          completedLessons,
        };
      })
    );

    res.status(200).json({
      success: true,
      enrollments: coursesWithProgress.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher analytics
// @route   GET /api/courses/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.isPublished).length;
    const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolledCount, 0);

    // Recent enrollments
    const recentEnrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name email avatar')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Per-course stats
    const courseStats = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      enrolledCount: c.enrolledCount,
      isPublished: c.isPublished,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalStudents,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        recentEnrollments,
        courseStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
