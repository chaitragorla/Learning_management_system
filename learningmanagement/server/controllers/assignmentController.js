// server/controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const User = require('../models/User');

/**
 * @desc  Get assignments for a course
 * @route GET /api/assignments/course/:courseId
 * @access Private
 */
const getAssignmentsByCourse = async (req, res) => {
  const assignments = await Assignment.find({ courseId: req.params.courseId }).sort({ deadline: 1 });
  res.json(assignments);
};

/**
 * @desc  Get all assignments for courses the student is enrolled in
 * @route GET /api/assignments/my
 * @access Private/Student
 */
const getMyAssignments = async (req, res) => {
  const Enrollment = require('../models/Enrollment');
  const enrollments = await Enrollment.find({ userId: req.user._id });
  const courseIds = enrollments.map((e) => e.courseId);
  const assignments = await Assignment.find({ courseId: { $in: courseIds } })
    .populate('courseId', 'title')
    .sort({ deadline: 1 });

  // Attach submission status for each assignment
  const submissions = await Submission.find({
    assignmentId: { $in: assignments.map((a) => a._id) },
    userId: req.user._id,
  });
  const submissionMap = {};
  submissions.forEach((s) => {
    submissionMap[s.assignmentId.toString()] = s;
  });

  const result = assignments.map((a) => ({
    ...a.toObject(),
    submission: submissionMap[a._id.toString()] || null,
  }));

  res.json(result);
};

/**
 * @desc  Create an assignment
 * @route POST /api/assignments
 * @access Private/Instructor
 */
const createAssignment = async (req, res) => {
  const { courseId, title, description, deadline, maxScore } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const assignment = await Assignment.create({
    courseId,
    instructorId: req.user._id,
    title,
    description: description || '',
    deadline: new Date(deadline),
    maxScore: maxScore || 100,
    attachmentUrl: req.file ? req.file.path : '',
  });

  // Notify enrolled students
  const Enrollment = require('../models/Enrollment');
  const enrollments = await Enrollment.find({ courseId });
  const notifyPromises = enrollments.map((e) =>
    User.findByIdAndUpdate(e.userId, {
      $push: {
        notifications: {
          message: `New assignment "${title}" added to ${course.title}`,
        },
      },
    })
  );
  await Promise.all(notifyPromises);

  res.status(201).json(assignment);
};

/**
 * @desc  Update an assignment
 * @route PUT /api/assignments/:id
 * @access Private/Instructor
 */
const updateAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (assignment.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { title, description, deadline, maxScore } = req.body;
  const updated = await Assignment.findByIdAndUpdate(
    req.params.id,
    { title, description, deadline, maxScore },
    { new: true }
  );
  res.json(updated);
};

/**
 * @desc  Delete an assignment
 * @route DELETE /api/assignments/:id
 * @access Private/Instructor
 */
const deleteAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (assignment.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await Assignment.findByIdAndDelete(req.params.id);
  await Submission.deleteMany({ assignmentId: req.params.id });
  res.json({ message: 'Assignment deleted' });
};

/**
 * @desc  Submit an assignment (student)
 * @route POST /api/assignments/:id/submit
 * @access Private/Student
 */
const submitAssignment = async (req, res) => {
  const { note } = req.body;
  const assignmentId = req.params.id;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  const isLate = new Date() > new Date(assignment.deadline);

  // Check for existing submission
  const existing = await Submission.findOne({ assignmentId, userId: req.user._id });
  if (existing) return res.status(409).json({ message: 'Already submitted' });

  const submission = await Submission.create({
    assignmentId,
    userId: req.user._id,
    fileUrl: req.file ? req.file.path : '',
    publicId: req.file ? req.file.filename : '',
    note: note || '',
    status: isLate ? 'late' : 'submitted',
  });

  res.status(201).json(submission);
};

/**
 * @desc  Get all submissions for an assignment (instructor)
 * @route GET /api/assignments/:id/submissions
 * @access Private/Instructor
 */
const getSubmissions = async (req, res) => {
  const submissions = await Submission.find({ assignmentId: req.params.id })
    .populate('userId', 'name email avatar')
    .sort({ submittedAt: -1 });
  res.json(submissions);
};

/**
 * @desc  Grade a submission
 * @route PUT /api/assignments/submissions/:submissionId/grade
 * @access Private/Instructor
 */
const gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await Submission.findByIdAndUpdate(
    req.params.submissionId,
    { grade, feedback, status: 'graded', gradedAt: new Date() },
    { new: true }
  ).populate('userId', 'name email');

  if (!submission) return res.status(404).json({ message: 'Submission not found' });

  // Notify student
  await User.findByIdAndUpdate(submission.userId._id, {
    $push: {
      notifications: {
        message: `Your assignment submission has been graded: ${grade} points`,
      },
    },
  });

  res.json(submission);
};

module.exports = {
  getAssignmentsByCourse,
  getMyAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
};
