const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

// @desc    Create a lesson
// @route   POST /api/lessons
exports.createLesson = async (req, res, next) => {
  try {
    const { title, content, videoUrl, duration, moduleId, order, resources } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return next(new AppError('Module not found.', 404));
    }

    // Verify teacher owns the course
    const course = await Course.findById(module.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      duration,
      module: moduleId,
      order: order || module.lessons.length + 1,
      resources,
    });

    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new AppError('Lesson not found.', 404));
    }

    const module = await Module.findById(lesson.module);
    const course = await Course.findById(module.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new AppError('Lesson not found.', 404));
    }

    const module = await Module.findById(lesson.module);
    const course = await Course.findById(module.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    // Remove from module
    module.lessons = module.lessons.filter((l) => l.toString() !== lesson._id.toString());
    await module.save();

    await Lesson.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Lesson deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a lesson
// @route   GET /api/lessons/:id
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(new AppError('Lesson not found.', 404));
    }

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a module
// @route   POST /api/lessons/modules
exports.createModule = async (req, res, next) => {
  try {
    const { title, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError('Course not found.', 404));
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    const module = await Module.create({
      title,
      course: courseId,
      order: order || course.modules.length + 1,
    });

    course.modules.push(module._id);
    await course.save();

    res.status(201).json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a module
// @route   PUT /api/lessons/modules/:id
exports.updateModule = async (req, res, next) => {
  try {
    let module = await Module.findById(req.params.id);
    if (!module) {
      return next(new AppError('Module not found.', 404));
    }

    const course = await Course.findById(module.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, module });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a module
// @route   DELETE /api/lessons/modules/:id
exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return next(new AppError('Module not found.', 404));
    }

    const course = await Course.findById(module.course);
    if (course.teacher.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized.', 403));
    }

    // Delete all lessons in this module
    await Lesson.deleteMany({ module: module._id });

    // Remove from course
    course.modules = course.modules.filter((m) => m.toString() !== module._id.toString());
    await course.save();

    await Module.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Module deleted.' });
  } catch (error) {
    next(error);
  }
};
