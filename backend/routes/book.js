const express = require('express');
const bookCtrl = require('../controllers/books');

const router = express.Router();

router.get('/', bookCtrl.getAllBook)

module.exports = router;