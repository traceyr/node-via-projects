'use strict';

let mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


mongoose.connect('mongodb://localhost/nodeauth', { useNewUrlParser: true }).then(
  () => { console.log('connected successfully'); },
  err => { console.log(err); }
);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//User Schema
let UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimg: {
    type: String
  }
});

let User =  module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, cb) {
  User.findById(id, cb);
};

module.exports.getUserByUsername = function(username, cb) {
  let query = { username: username };
  User.findOne(query, cb);
};

module.exports.comparePassword = function(candidatePW, hash, cb) {
  bcryptjs.compare(candidatePW, hash, function(err, isMatch) {
    cb(null, isMatch);
  });
};

module.exports.createUser = function(newUser, cb) {
  bcryptjs.genSalt(10, function(err, salt) {
    bcryptjs.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(cb);
    });
  });
};
