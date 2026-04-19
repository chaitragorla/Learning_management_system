// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary with environment credentials (cloudinary v1 SDK).
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
