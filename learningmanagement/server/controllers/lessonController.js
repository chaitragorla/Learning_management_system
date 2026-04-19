// server/controllers/lessonController.js
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');

/**
 * @desc  Get all lessons for a course
 * @route GET /api/lessons/course/:courseId
 * @access Public (free lessons) / Private (enrolled)
 */
const getLessonsByCourse = async (req, res) => {
  const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('order');
  res.json(lessons);
};

/**
 * @desc  Add a lesson to a course
 * @route POST /api/lessons
 * @access Private/Instructor
 */
const createLesson = async (req, res) => {
  const { courseId, title, description, type, order, isFree } = req.body;

  // Verify instructor owns the course
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const lesson = await Lesson.create({
    courseId,
    title,
    description: description || '',
    type: type || 'video',
    order: order || 0,
    isFree: isFree === 'true' || isFree === true,
    contentUrl: req.file ? req.file.path : '',
    publicId: req.file ? req.file.filename : '',
  });

  // Update course totalLessons count
  await Course.findByIdAndUpdate(courseId, { $inc: { totalLessons: 1 } });

  res.status(201).json(lesson);
};

/**
 * @desc  Update a lesson
 * @route PUT /api/lessons/:id
 * @access Private/Instructor
 */
const updateLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

  const course = await Course.findById(lesson.courseId);
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { title, description, order, isFree } = req.body;
  const update = { title, description, order, isFree };
  if (req.file) {
    update.contentUrl = req.file.path;
    update.publicId = req.file.filename;
  }

  const updated = await Lesson.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(updated);
};

/**
 * @desc  Delete a lesson
 * @route DELETE /api/lessons/:id
 * @access Private/Instructor
 */
const deleteLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

  const course = await Course.findById(lesson.courseId);
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Delete from Cloudinary if exists
  if (lesson.publicId) {
    try {
      const resourceType = lesson.type === 'video' ? 'video' : lesson.type === 'pdf' ? 'raw' : 'image';
      await cloudinary.uploader.destroy(lesson.publicId, { resource_type: resourceType });
    } catch (err) {
      console.error('Cloudinary delete error:', err.message);
    }
  }

  await Lesson.findByIdAndDelete(req.params.id);
  await Course.findByIdAndUpdate(lesson.courseId, { $inc: { totalLessons: -1 } });

  res.json({ message: 'Lesson deleted' });
};

module.exports = { getLessonsByCourse, createLesson, updateLesson, deleteLesson };
