const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: 2000,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  }],
  enrolledCount: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  tags: [String],
}, {
  timestamps: true,
});

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ teacher: 1 });
courseSchema.index({ category: 1 });

module.exports = mongoose.model('Course', courseSchema);
