const { renderToStaticMarkup } = require('react-dom/server')
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

exports.postBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    const protocol = req.protocol;
    const host = req.get('host');
    const imgName = req.file.filename;
    const url = `${protocol}://${host}/uploads/books/${imgName}`

    const book = new Book({
        ...bookObject,
        ratings: [],
        averageRating: 0,
        userId: req.user.userId,
        imageUrl: url,
    })
    book.save()
        .then(() => {
            res.status(201).json({ message: "Book created successfully" })
        })
        .catch((error) => {
            res.status(400).json({ error })
            console.log(error)
        })
}

exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.userId
    Book.findById(bookId)
    .then((book) => {
        if(!book) {
            return res.status(404).json({ message: "404 | Book not found " })
        }
        if(userId !== book.userId) {
           return res.status(403).json({ message: "Unauthorized book modification" })
        }
        let updateBook
        if(req.file) {
            const bookObject = JSON.parse(req.body.book)
            const protocol = req.protocol;
            const host = req.get('host');
            const imgName = req.file.filename;
            const url = `${protocol}://${host}/uploads/books/${imgName}`

            updateBook = {
                ...bookObject,
                imageUrl: url
            }
        } else {
            updateBook = {
                ...req.body
            }
        }
        Book.findByIdAndUpdate(bookId, updateBook)
        .then(() => {
            res.status(200).json({ message: "Book updated sucessfully" })
        })
        .catch(() => {
            res.status(500).json({ message: "Internal error server" })
        })
    })
    .catch(() => {
        res.status(500).json({ message: "Internal error server" })
    })
}