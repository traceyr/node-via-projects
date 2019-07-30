var express = require('express');
var router = express.Router();
let multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let mongo = require('mongodb');
let db = require('monk')('localhost/nodeblog');


router.get('/add', function(req, res, next) {
  res.render('addpost', {
    'title': 'Add Post'
  });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  //Get Form value
  let title = req.body.title;
  let category = req.body.category;
  let body = req.body.body;
  let author = req.body.author;
  let date = new Date();

  if(req.file) {
    let mainimage = req.file.filename;
  } else {
    var mainimage = 'noimage.jpg';
  }

  console.log(mainimage);
  let errors = req.validationErrors();

  if(errors) {
    console.log(errors, 'tr');
    res.render('addpost', {
      'errors': errors,
      'title': title,
      'body': body
    });
  } else {
    let posts = db.get('posts');
    posts.insert({
      'title': title,
      'body': body,
      'category': category,
      'date': date,
      'author': author,
      'mainimage': mainimage
    }, function(err, post) {
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        req.flash('success', 'Post Added');
        res.location('/');
        res.redirect();
      }
    });
  }
});

module.exports = router;
