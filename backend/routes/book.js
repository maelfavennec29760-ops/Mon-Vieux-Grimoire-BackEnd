const express = require('express');
const multerCtrl = require('../middleware/multer')
const tokenCtrl = require('../middleware/authMiddleware')
const bookCtrl = require('../controllers/books');

const router = express.Router();

router.get('/', bookCtrl.getAllBook)
router.get('/:id', bookCtrl.getBookById)
router.post('/', tokenCtrl.token, multerCtrl.bookImageUpload.single("image"), bookCtrl.postBook)

module.exports = router;