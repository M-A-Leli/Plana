import multer from 'multer';
import path from 'path';

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../images/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Initialize single file upload
const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image'); // Single image upload

// Initialize multiple files upload
const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).array('images', 4); // Multiple images upload, max 4

// Check file type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
}

export { uploadSingle, uploadMultiple };
