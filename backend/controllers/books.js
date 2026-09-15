const Book = require('../models/Books')

exports.getAllBook = (req, res) => {
    Book.find()
    .then((books) => {
        res.status(200).json(books)
    })
    .catch((error) => {
        res.status(500).json({ message: "Books loading error", error })
    })
}

