const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    preparation: {
        type: Number,
        required: true
    },
    people: {
        type: Number,
        require: true
    },
    views: {
        type: Number,
        default: 0,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }

}, { timestamps: true });

module.exports = mongoose.model('recipe', recipeSchema);