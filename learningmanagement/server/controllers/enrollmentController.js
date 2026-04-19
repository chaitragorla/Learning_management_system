// server/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

/**
 * @desc  Enroll in a course
 * @route POST /api/enrollments
 * @access Private/Student
 */
const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!course.isPublished) return res.status(400).json({ message: 'Course is not published' });

  // Check if already enrolled
  const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
  if (existing) return res.status(409).json({ message: 'Already enrolled in this course' });

  const enrollment = await Enrollment.create({ userId: req.user._id, courseId });

  // Initialize progress record
  await Progress.create({ userId: req.user._id, courseId });

  // Increment enrollment count
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  res.status(201).json(enrollment);
};

/**
 * @desc  Get enrolled courses for logged-in student
 * @route GET /api/enrollments/my
 * @access Private
 */
const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user._id })
    .populate({
      path: 'courseId',
      populate: { path: 'instructorId', select: 'name avatar' },
    })
    .sort({ createdAt: -1 });

  // Attach progress to each enrollment
  const progressRecords = await Progress.find({ userId: req.user._id });
  const progressMap = {};
  progressRecords.forEach((p) => {
    progressMap[p.courseId.toString()] = p.completionPercentage;
  });

  const result = enrollments.map((e) => ({
    ...e.toObject(),
    progress: progressMap[e.courseId?._id?.toString()] || 0,
  }));

  res.json(result);
};

/**
 * @desc  Get all students enrolled in a course (instructor)
 * @route GET /api/enrollments/course/:courseId
 * @access Private/Instructor
 */
const getCourseStudents = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const enrollments = await Enrollment.find({ courseId: req.params.courseId })
    .populate('userId', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(enrollments);
};

/**
 * @desc  Check if student is enrolled in a course
 * @route GET /api/enrollments/check/:courseId
 * @access Private
 */
const checkEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: req.params.courseId,
  });
  res.json({ enrolled: !!enrollment });
};

module.exports = { enrollInCourse, getMyEnrollments, getCourseStudents, checkEnrollment };
