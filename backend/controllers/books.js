const { renderToStaticMarkup } = require('react-dom/server');
const Book = require('../models/Books');
const fs = require('fs').promises;
const path = require('path');

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

exports.getBestRating = (req, res) => {
    Book.find().sort({ averageRating: -1}).limit(3)
    .then((bestRating) => {
        res.status(200).json(bestRating)
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to retrieve top-rated books", error })
    })
}

exports.deleteBook = (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.userId
    Book.findById(bookId)
    .then((book) => {
        if(!book) {
            return res.status(404).json({ message: "404 | Book not found " })
        }
        if(userId !== book.userId) {
            return res.status(403).json({ message: "Unauthorized book delete" })
        }
        const imageUrl = book.imageUrl;
        const urlParts = imageUrl.split("/");
        const filename = urlParts.at(-1);
        const imagePath = path.join('uploads', 'books', filename)
        Book.findByIdAndDelete(bookId)
        .then(() => {
            return fs.unlink(imagePath)
        })
        .then(() => {
            res.status(200).json({ message: "Book deleted successfully" })
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to delete book", error })
        })
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to delete book", error })
    })
}

exports.ratingBook = (req, res) => {
    const bookId = req.params.id;
    const { userId, rating } = req.body;
    Book.findById(bookId)
    .then((book) => {
        if(!book){
            return res.status(404).json({ message: "404 | Book not found " })
        }
        if(rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" })
        }
        if(userId !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized rating"})
        }
        const existingRating = book.ratings.find((rate) => rate.userId === userId)
        if(existingRating) {
            return res.status(400).json({ message: "User has already rated this book" })
        }
        const newRating = {
            userId: userId,
            grade: rating
        }
        book.ratings.push(newRating)
        const totalGrade = book.ratings.reduce((accumulator, currentRating) => {
            return accumulator + currentRating.grade
        }, 0)
        book.averageRating = Number((totalGrade / book.ratings.length).toFixed(1));
        return book.save()
    })
    .then((book) => {
        if(book) {
        res.status(200).json(book)
        }
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to rate book", error })
    })
}