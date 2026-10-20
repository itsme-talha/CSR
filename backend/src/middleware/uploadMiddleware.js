const multer = require('multer');
const path = require('path');

// Storage engine configure karna
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files kahan save hongi
    },
    filename: (req, file, cb) => {
        // Unique filename banana taake duplicate naam wali files overwrite na hon
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File type validation (Sirf images aur PDFs allow karna)
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Sirf Images (jpeg/jpg/png) aur PDFs allowed hain!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size limit
    fileFilter
});

module.exports = upload;