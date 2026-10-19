const mongoose = require('mongoose');
const uniqueValidatorModule = require('mongoose-unique-validator');
const uniqueValidator = uniqueValidatorModule.default || uniqueValidatorModule;

// Structure user MongoDB


const userSchema = new mongoose.Schema({
    //Model
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema);

module.exports = User;