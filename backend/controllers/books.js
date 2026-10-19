
const Book = require('../models/Books');
const fs = require('fs').promises;
const path = require('path');

exports.getAllBook = (req, res) => {
    Book.find()
    .then((books) => {
        res.status(200).json(books)
    })
    .catch((error) => {
        res.status(500).json({ error })
    })
}

exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    Book.findById(bookId)
    .then((book) => {
        if(!book) {
            return res.status(404).json({ message: "404 | Book not found" })
        }
        res.status(200).json(book)
    })
    .catch((error) => {
        res.status(500).json({ error })
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
        delete updateBook._id
        delete updateBook.userId
        delete updateBook.ratings
        delete updateBook.averageRating
        const oldImgName = book.imageUrl.split("/").at(-1); 
        Book.findByIdAndUpdate(bookId, updateBook, {
            runValidators: true
        })
        .then(() => {
            if(req.file) {
                fs.unlink(path.join('uploads', 'books', oldImgName))
                .catch((error) => console.error("Old image deletion failed:", error))
            }
            res.status(200).json({ message: "Book updated successfully" })
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
    })
    .catch((error) => {
        res.status(500).json({ error })
    })
}



exports.getBestRating = (req, res) => {
    Book.find().sort({ averageRating: -1}).limit(3)
    .then((bestRating) => {
        res.status(200).json(bestRating)
    })
    .catch((error) => {
        res.status(500).json({ error })
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
            res.status(500).json({ error })
        })
    })
    .catch((error) => {
        res.status(500).json({ error })
    })
}

exports.ratingBook = (req, res) => {
    const bookId = req.params.id;
    const { rating } = req.body;
    const userId = req.user.userId
    Book.findById(bookId)
    .then((book) => {
        if(!book){
            return res.status(404).json({ message: "404 | Book not found " })
        }
        if(typeof rating!== 'number' || !Number.isInteger(rating) || rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be an integer between 0 and 5" })
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
        res.status(200).json(book)
    })
    .catch((error) => {
        res.status(500).json({ error })
    })
}



