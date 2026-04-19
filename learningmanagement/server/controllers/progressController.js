// server/controllers/progressController.js
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

/**
 * @desc  Get progress for a course
 * @route GET /api/progress/:courseId
 * @access Private
 */
const getCourseProgress = async (req, res) => {
  const progress = await Progress.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  }).populate('completedLessons');

  if (!progress) return res.status(404).json({ message: 'No progress record found' });
  res.json(progress);
};

/**
 * @desc  Mark a lesson as complete
 * @route POST /api/progress/complete
 * @access Private
 */
const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;

  let progress = await Progress.findOne({ userId: req.user._id, courseId });
  if (!progress) {
    progress = await Progress.create({ userId: req.user._id, courseId });
  }

  // Add lesson to completed if not already there
  const alreadyDone = progress.completedLessons.some(
    (id) => id.toString() === lessonId.toString()
  );

  if (!alreadyDone) {
    progress.completedLessons.push(lessonId);
  }

  // Recalculate percentage
  const totalLessons = await Lesson.countDocuments({ courseId });
  progress.completionPercentage =
    totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  progress.lastAccessedAt = new Date();

  await progress.save();

  // If 100% complete, mark enrollment as completed
  if (progress.completionPercentage === 100) {
    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId },
      { status: 'completed', completedAt: new Date() }
    );
  }

  res.json(progress);
};

/**
 * @desc  Get all progress records for current user
 * @route GET /api/progress/my
 * @access Private
 */
const getMyProgress = async (req, res) => {
  const records = await Progress.find({ userId: req.user._id })
    .populate('courseId', 'title thumbnail totalLessons')
    .sort({ lastAccessedAt: -1 });
  res.json(records);
};

module.exports = { getCourseProgress, markLessonComplete, getMyProgress };
