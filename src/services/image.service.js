import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp"; // Import the sharp library

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Save files to the 'uploads' directory temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a temporary file name
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max file size 20MB
  fileFilter: (req, file, cb) => {
    // Optional: Check file type (e.g., images only)
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Middleware to handle image upload (for the category creation endpoint)
const uploadSingleImage = upload.single("image"); // 'image' is the name of the field in the form

// Middleware to convert uploaded image to WebP format
const convertToWebP = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded!"));
  }

  try {
    const originalPath = req.file.path; // Original uploaded file path
    const webpPath = `./uploads/${Date.now()}.webp`; // Path for the converted WebP file

    // Convert the uploaded image to WebP format using sharp
    await sharp(originalPath)
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toFile(webpPath);

    // Delete the original uploaded file (optional)
    fs.unlinkSync(originalPath);

    // Update req.file to point to the new WebP file
    req.file.path = webpPath;
    req.file.filename = path.basename(webpPath);

    next();
  } catch (err) {
    next(err);
  }
};

export { uploadSingleImage, convertToWebP };
