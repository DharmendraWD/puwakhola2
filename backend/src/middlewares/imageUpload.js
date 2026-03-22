const multer = require("multer");
const fs = require("fs");
const path = require("path");

//  Allowed upload folders
const allowedSections = [
  "users",
  "clients",
  "blogs",
  "services",
  "projects",
  "gallery",
  "herosectionimg",
  "missionimg",
  "aboutusimg",
  "team",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract folder name from API route
    // For /api/users, it extracts 'users'
    // For /api/blogs, it extracts 'blogs'
    const routeParts = req.originalUrl.split('/');
    const section = routeParts[routeParts.length - 1]; // Gets the last part of the URL
    
    console.log("Detected section:", section);

    // 🔒 Security check
    if (!allowedSections.includes(section)) {
      return cb(new Error("Invalid upload section"));
    }

    const uploadPath = path.join("uploads", section);

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload; // Export multer instance directly