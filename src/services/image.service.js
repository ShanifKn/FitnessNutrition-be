import multer from "multer";
import path from "path";

// Set up Multer storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name using timestamp
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max file size 70MB
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

export default uploadSingleImage;
