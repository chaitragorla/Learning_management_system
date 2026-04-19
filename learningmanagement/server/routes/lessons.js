// server/routes/lessons.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');

router.get('/course/:courseId', getLessonsByCourse);
router.post('/', protect, authorize('instructor'), upload.single('content'), createLesson);
router.put('/:id', protect, authorize('instructor'), upload.single('content'), updateLesson);
router.delete('/:id', protect, authorize('instructor'), deleteLesson);

module.exports = router;
