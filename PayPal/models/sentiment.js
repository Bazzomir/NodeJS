const mongoose = require('mongoose');

const sentimentSchema = mongoose.Schema({
  emoji: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'post'
  }
}, { timestamps: true });

module.exports = mongoose.model('sentiment', sentimentSchema)
