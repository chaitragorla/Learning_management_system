// server/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    grade: {
      type: Number,
      min: 0,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent duplicate submissions per user per assignment
submissionSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
