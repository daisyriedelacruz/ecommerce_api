const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with credentials from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define where and how to save uploaded files on the cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "crafty_club_bouquets", // Folder name inside your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;
