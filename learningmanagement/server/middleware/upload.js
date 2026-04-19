// server/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/**
 * Cloudinary storage for general files (videos, PDFs, images).
 * Files are stored in the 'lms-uploads' folder.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto';
    let folder = 'lms-uploads';

    if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
      folder = 'lms-videos';
    } else if (file.mimetype === 'application/pdf') {
      resourceType = 'raw';
      folder = 'lms-pdfs';
    } else if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
      folder = 'lms-images';
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'webm'],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

module.exports = upload;
