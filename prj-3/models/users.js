'use strict';

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth', { useNewUrlParser: true }).then(
  () => { console.log('connected successfully'); },
  err => { console.log(err); }
);

let db = mongoose.connection;

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

module.exports.createUser = function(newUser, cb) {
  newUser.save(cb);
};
