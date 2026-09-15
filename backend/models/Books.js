const mongoose = require('mongoose')

//Structure Book

const bookSchema = new mongoose.Schema({
    //Model
    userId: {type: String},
    title: {type: String},
    author: {type: String},
    imageUrl: {type: String},
    year: {type: Number},
    genre: {type: String},
    ratings: [
        {
            userId: {type: String},
            grade: {type: Number}
        }
    ],
    averageRating: {type: Number}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book