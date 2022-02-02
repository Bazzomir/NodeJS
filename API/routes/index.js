var express = require('express');
var router = express.Router();
const controller = require('../controllers/recipes');

router.get('/home', controller.getHomePage);

module.exports = router;
