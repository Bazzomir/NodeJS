const Post = require('../models/post');
const Sentiment = require('../models/sentiment');

module.exports = {
  all: async (req, res) => {
    try {
      const posts = await Post.find().populate('user').populate('comments').populate('sentiments');

      res.send({
        error: false,
        message: 'List of all posts from the database for you my dear',
        posts: posts
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  },
  getByID: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('comments').populate('sentiments');
      const likes = await Sentiment.count({ emoji: 'like', post: req.params.id });
      const dislikes = await Sentiment.count({ emoji: 'dislike', post: req.params.id });

      res.send({
        error: false,
        message: `Details about post with id #${req.params.id}`,
        post,
        likes,
        dislikes
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  },
  getByUser: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id })

      res.send({
        error: false,
        message: `All posts for user with id #${req.params.id}`,
        posts: posts
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
      const post = await Post.create(req.body);

      res.status(201).send({
        error: false,
        message: `User with id #${ req.body.user } has just created a new post!`,
        post: post
      });
    } catch (error) {
      res.send({
        error: true,
        message: error.message
      });
    }
  },
  sentiment: async (req, res) => {
    // 1. Barame dali korisnikot vekje postavil nekoj sentiment na ovoj post
    const existingSentiment = await Sentiment.findOne({
      user: req.user.id,
      post: req.params.id
    });

    // 2. Ako korisnikot vekje ima ostaveno sentiment, izbrisi go i od kolekcijata sentiments
    // i od samiot zapis za post
    // 2.1 Dokolku ne postoi sentiment, zivotot odi ponatamu
    if (existingSentiment) {
      await Sentiment.findByIdAndDelete(existingSentiment._id);
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: {
          sentiments: existingSentiment._id
        }
      })
    }

    // 3. Kreiraj nov sentiment
    const sentiment = await Sentiment.create({
      emoji: req.body.emoji,
      user: req.user.id,
      post: req.params.id
    })

    // 4. Zakaci go na zapisot za post
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $push: {
        sentiments: sentiment._id
      }
    });

    res.send({
      post: post
    })
  }
}