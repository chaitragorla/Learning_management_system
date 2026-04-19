// server/routes/courses.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAnalytics,
} = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/my', protect, getMyCourses);
router.get('/analytics', protect, authorize('instructor'), getAnalytics);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('instructor'), upload.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('instructor'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

module.exports = router;
