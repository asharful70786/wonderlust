const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define schema
const userSchema = new mongoose.Schema({
    username: String,
});

// Apply passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;
