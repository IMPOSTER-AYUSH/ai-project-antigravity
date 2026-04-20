const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

progressSchema.index({ student: 1, course: 1 });
progressSchema.index({ student: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
