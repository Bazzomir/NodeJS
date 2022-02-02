const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  all: async (req, res) => {
    try {
      const comments = await Comment.find().populate('post').populate('user');

      res.send({
        error: false,
        message: 'List of all comments from the database',
        comments: comments
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  },
  create: async (req, res) => {
    try {
      req.body.user = req.user.id;
      const comment = await Comment.create(req.body);
      await Post.findByIdAndUpdate(req.body.post, {
        $push: {
          comments: comment._id
        }
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          comments: comment._id
        }
      });

      res.status(201).send({
        error: false,
        message: `User with id #${ req.body.user } has just posted a new comment!`,
        comment: comment
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  }
}