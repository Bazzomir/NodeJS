const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const cors = require('cors')

require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/babys-food');
mongoose.connect(`mongodb+srv://Bazzo97:${process.env.MONGODB_PASSWORD}@babysfood.71g0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(500).send({
            error: true,
            message: 'Login first!'
        })
    }
});

module.exports = app;
