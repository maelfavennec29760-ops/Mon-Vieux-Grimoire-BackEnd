const multer = require('multer')

const storage = multer.memoryStorage({
    destination: 'uploads/books',
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName)
    }
});

exports.bookImageUpload = multer({ storage });