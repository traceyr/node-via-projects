'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
let uploads = multer({ dest: './uploads' })
const connectFlash = require('connect-flash');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
let db = mongoose.connection;

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressValidator({
  errorFormatter: function(params, msg, value) {
    let namespace = params.split('.')
      , root = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift();
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(connectFlash());
app.use(function(req, res, next) {
  res.locals.message = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
