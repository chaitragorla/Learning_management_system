// server/routes/progress.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCourseProgress, markLessonComplete, getMyProgress } = require('../controllers/progressController');

router.get('/my', protect, getMyProgress);
router.get('/:courseId', protect, getCourseProgress);
router.post('/complete', protect, markLessonComplete);

module.exports = router;
