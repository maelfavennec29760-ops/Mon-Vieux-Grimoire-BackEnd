const express = require('express');
const tokenCtrl = require('../middleware/authMiddleware')
const bookCtrl = require('../controllers/books');

const router = express.Router();

router.get('/', bookCtrl.getAllBook)
router.get('/:id', bookCtrl.getBookById)
router.post('/', tokenCtrl.token, bookCtrl.postBook)

module.exports = router;