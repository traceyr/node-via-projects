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

app.listen(3000, () => {
  console.log('Server is up and running on port 3000');
});
