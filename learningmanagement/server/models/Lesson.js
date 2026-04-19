// server/models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    contentUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String, // Cloudinary public_id for deletion
      default: '',
    },
    type: {
      type: String,
      enum: ['video', 'pdf', 'text', 'quiz'],
      default: 'video',
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
