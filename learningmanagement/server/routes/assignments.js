// server/routes/assignments.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAssignmentsByCourse,
  getMyAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
} = require('../controllers/assignmentController');

router.get('/my', protect, getMyAssignments);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.post('/', protect, authorize('instructor'), upload.single('attachment'), createAssignment);
router.put('/:id', protect, authorize('instructor'), updateAssignment);
router.delete('/:id', protect, authorize('instructor'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), upload.single('submission'), submitAssignment);
router.get('/:id/submissions', protect, authorize('instructor'), getSubmissions);
router.put('/submissions/:submissionId/grade', protect, authorize('instructor'), gradeSubmission);

module.exports = router;
