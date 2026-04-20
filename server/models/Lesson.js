const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  resources: [{
    name: String,
    url: String,
  }],
}, {
  timestamps: true,
});

lessonSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
