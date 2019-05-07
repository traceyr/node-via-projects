'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', { title: 'welcome' });
  console.log('Welcome Page');
});

app.get('/about', (req, res) => {
  res.render('about');
  console.log('About Page');
});

app.get('/contact', (req, res) => {
  res.render('contact');
  console.log('Contact Page');
});

app.post('/contact/send', (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'email@gmail.com',
      pass: 'this is obs not real'   // For two factor auth, you have to go to your emails security and creat a mail specific fake password. Once I did that, this worked.
    }
  });
  let mailOptions = {
    //WHY SO MUCH HARDCODING IN THIS TUTORIAL???
    from: 'T R <email@gmail.com>',
    to: 'email@gmail.com',
    subject: 'Words GAHHH',
    text: 'You have mail...Name: ' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
    html: '<p>You have mail...</p><ul><li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      console.log('Message sent: ' + info.response);
      res.redirect('/');
    }
  });
  console.log('Contact Page Submit Test');
});

app.listen(3000, () => {
  console.log('Server is up and running on port 3000');
});
