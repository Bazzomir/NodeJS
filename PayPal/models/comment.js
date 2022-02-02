const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: {
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

/**
 * Post 1<>M Comment
 * User 1<>M Comment
 */

module.exports = mongoose.model('comment', commentSchema)
