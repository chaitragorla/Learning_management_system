// server/controllers/courseController.js
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

/**
 * @desc  Get all published courses (with optional search/filter)
 * @route GET /api/courses
 * @access Public
 */
const getCourses = async (req, res) => {
  const { search, category, level, page = 1, limit = 12 } = req.query;
  const query = { isPublished: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (level) query.level = level;

  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('instructorId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Course.countDocuments(query),
  ]);

  res.json({ courses, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

/**
 * @desc  Get courses created by the logged-in instructor
 * @route GET /api/courses/my
 * @access Private/Instructor
 */
const getMyCourses = async (req, res) => {
  const courses = await Course.find({ instructorId: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
};

/**
 * @desc  Get a single course by ID
 * @route GET /api/courses/:id
 * @access Public
 */
const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructorId', 'name avatar bio');
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const lessons = await Lesson.find({ courseId: course._id }).sort('order');
  const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });

  res.json({ ...course.toObject(), lessons, enrollmentCount });
};

/**
 * @desc  Create a course
 * @route POST /api/courses
 * @access Private/Instructor
 */
const createCourse = async (req, res) => {
  const { title, description, category, level, price, tags } = req.body;

  const course = await Course.create({
    title,
    description,
    category,
    level,
    price: price || 0,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    instructorId: req.user._id,
    thumbnail: req.file ? req.file.path : '',
  });

  res.status(201).json(course);
};

/**
 * @desc  Update a course
 * @route PUT /api/courses/:id
 * @access Private/Instructor
 */
const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to edit this course' });
  }

  const { title, description, category, level, price, tags, isPublished } = req.body;
  const update = { title, description, category, level, price, isPublished };
  if (tags) update.tags = tags.split(',').map((t) => t.trim());
  if (req.file) update.thumbnail = req.file.path;

  const updated = await Course.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(updated);
};

/**
 * @desc  Delete a course
 * @route DELETE /api/courses/:id
 * @access Private/Instructor
 */
const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (course.instructorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await Promise.all([
    Course.findByIdAndDelete(req.params.id),
    Lesson.deleteMany({ courseId: req.params.id }),
    Enrollment.deleteMany({ courseId: req.params.id }),
  ]);

  res.json({ message: 'Course deleted successfully' });
};

/**
 * @desc  Get instructor analytics
 * @route GET /api/courses/analytics
 * @access Private/Instructor
 */
const getAnalytics = async (req, res) => {
  const courses = await Course.find({ instructorId: req.user._id });
  const courseIds = courses.map((c) => c._id);

  const [totalEnrollments, recentEnrollments] = await Promise.all([
    Enrollment.countDocuments({ courseId: { $in: courseIds } }),
    Enrollment.find({ courseId: { $in: courseIds } })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('userId', 'name avatar')
      .populate('courseId', 'title'),
  ]);

  // Monthly enrollment data for chart
  const monthlyData = {};
  recentEnrollments.forEach((e) => {
    const month = new Date(e.createdAt).toLocaleString('default', { month: 'short' });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  res.json({
    totalCourses: courses.length,
    totalEnrollments,
    totalStudents: totalEnrollments,
    monthlyEnrollments: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
    recentEnrollments: recentEnrollments.slice(0, 5),
  });
};

module.exports = { getCourses, getMyCourses, getCourseById, createCourse, updateCourse, deleteCourse, getAnalytics };
