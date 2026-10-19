const mongoose = require('mongoose')

//Structure Book

const bookSchema = new mongoose.Schema({
    //Model
    userId: {type: String, required: true},
    title: {type: String, required: true, trim: true},
    author: {type: String, required: true, trim: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true, min: 0},
    genre: {type: String, required: true, trim: true},
    ratings: [
        {
        userId: {type: String, required: true},
        grade: {type: Number, required: true, min: 0, max: 5}
        }
    ],
    averageRating: {type: Number, default: 0, min: 0, max: 5}
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book

