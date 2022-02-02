var express = require('express');
var router = express.Router();
const controller = require('../controllers/comments');
const jwt = require('express-jwt');

require('dotenv').config();

router.get('/', controller.all)
      .post('/', jwt({ secret: process.env.AUTH_SECRET, algorithms: ['HS256'] }), controller.create);

module.exports = router;
