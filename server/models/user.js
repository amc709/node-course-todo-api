const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email:  {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message:  '{VALUE} is not a valid email'
    }
  },
  password: {
      type: String,
      required: true,
      minlength: 6,

      // I added this validator
      validate: {
        validator: (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*[\W_\s]).{6,20}$/.test(value);
        },
        message: 'Password should contain at least one lowercase letter, one uppercase letter, one number, no non-alphanumberic characters, and should be between 6-20 characters'
      }
  },
  tokens:  [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
  }]

});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({access,token});

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

// var newUser = new User({
//   email: 'anthony@abc.com'
// });
//
// newUser.save().then((doc) => {
//   console.log('User saved:  ', JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log('Unable to save user:', err);
// });


module.exports = {User};
