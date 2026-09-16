const express = require('express');
const multerCtrl = require('../middleware/multer')
const imageCtrl = require('../middleware/imageOptimizer')
const tokenCtrl = require('../middleware/authMiddleware')
const bookCtrl = require('../controllers/books');

const router = express.Router();

router.get('/', bookCtrl.getAllBook)
router.get('/bestrating', bookCtrl.getBestRating)
router.get('/:id', bookCtrl.getBookById)
router.put('/:id', tokenCtrl.token,multerCtrl.bookImageUpload.single("image"), imageCtrl.optimizeBookImage, bookCtrl.updateBook)
router.post('/', tokenCtrl.token, multerCtrl.bookImageUpload.single("image"), imageCtrl.optimizeBookImage, bookCtrl.postBook)

module.exports = router;