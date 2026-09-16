const express = require('express');
const bookCtrl = require('../controllers/books');

const router = express.Router();

router.get('/', bookCtrl.getAllBook)
router.get('/:id', bookCtrl.getBookById)

module.exports = router;