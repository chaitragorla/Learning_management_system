// server/routes/announcements.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const Course = require('../models/Course');

// Get announcements for a course
router.get('/course/:courseId', protect, async (req, res) => {
  const announcements = await Announcement.find({ courseId: req.params.courseId })
    .populate('instructorId', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(announcements);
});

// Create announcement
router.post('/', protect, authorize('instructor'), async (req, res) => {
  const { courseId, title, content } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const announcement = await Announcement.create({
    courseId,
    instructorId: req.user._id,
    title,
    content,
  });
  res.status(201).json(announcement);
});

// Delete announcement
router.delete('/:id', protect, authorize('instructor'), async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});

module.exports = router;
