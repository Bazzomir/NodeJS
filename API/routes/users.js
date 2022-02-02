const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const jwt = require('express-jwt');

router
      // .get('/', controller.getAllUsers)
      .post('/register', controller.postUserSingUp)
      .post('/login', controller.postUserSingIn)
      .post('/logout', jwt({ secret: process.env.SECRET_AUTH_TOKEN, algorithms: ['HS256'] }), controller.postUserSingOut)
      .patch('/edit', jwt({ secret: process.env.SECRET_AUTH_TOKEN, algorithms: ['HS256'] }), controller.postUserEdit)
      .get('/edit', jwt({ secret: process.env.SECRET_AUTH_TOKEN, algorithms: ['HS256'] }), controller.getUserEdit)
      .get('/me', jwt({ secret: process.env.SECRET_AUTH_TOKEN, algorithms: ['HS256'] }), controller.getUserById)
      .delete('/', jwt({ secret: process.env.SECRET_AUTH_TOKEN, algorithms: ['HS256'] }), controller.deleteUser)

module.exports = router;
