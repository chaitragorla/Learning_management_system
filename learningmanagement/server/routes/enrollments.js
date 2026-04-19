// server/routes/enrollments.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  enrollInCourse,
  getMyEnrollments,
  getCourseStudents,
  checkEnrollment,
} = require('../controllers/enrollmentController');

router.post('/', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.get('/course/:courseId', protect, getCourseStudents);

module.exports = router;
