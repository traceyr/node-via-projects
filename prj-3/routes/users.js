'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let uploads = multer({ dest: './uploads' });

let User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password' }),
  function(req, res) {
    console.log('here');
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if(err) throw err;
    if(!user) return done(null, false, { message: 'Unknown User'});
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      isMatch ? done(null, user) : done(null, false, { message: 'Invalid Password' });
    });
  });
}));

router.post('/register', uploads.single('profileimg'), function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let profileimg;

  if(req.file) {
    console.log('Uploading File....');
    profileimg = req.file.filename;
  } else {
    console.log('No File Uploading...');
    profileimg = 'noimage.jpg';
  }
  //Form validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  //Check errors
  let errors = req.validationErrors();

  if(errors) {
    console.log('err');
    res.render('register', {
      errors: errors
    });
  } else {
    console.log('creating user');
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimg: profileimg
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');

    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out');
  res.redirect('/users/login');
});

module.exports = router;
