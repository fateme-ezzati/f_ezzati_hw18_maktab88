const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const session = require("express-session");

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/usersDB').then(() => {
  console.log("DB is connected.");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "mySecrectKeyForAuthProject",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));


app.use((req, res, next) => {
  console.log("my session====>",req.session);
  next()
})

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
