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

exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    Book.findById(bookId)
    .then((book) => {
        res.status(200).json(book)
    })
    .catch((error) => {
        res.status(500).json({ message: "Book loading error", error })
    })
}

