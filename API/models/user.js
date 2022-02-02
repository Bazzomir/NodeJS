const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    birthday: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
