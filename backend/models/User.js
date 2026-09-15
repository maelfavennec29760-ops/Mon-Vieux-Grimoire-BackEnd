const mongoose = require('mongoose');

// Structure user MongoDB


const userSchema = new mongoose.Schema({
    //Model
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;