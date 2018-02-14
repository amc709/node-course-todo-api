const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
      minlength: 6

      // I added this validator
      // validate: {
      //   validator: (value) => {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*[\W_\s]).{6,20}$/.test(value);
      //   },
      //   message: 'Password should contain at least one lowercase letter, one uppercase letter, one number, no non-alphanumberic characters, and should be between 6-20 characters'
      // }
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

}
, {
  usePushEach: true
}
);

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  // user.tokens.push({access,token});
  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};


UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};


// statics creates model methods (not instance methods)
UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;  // will store decoded jwt values

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e){
    // return new Promise((resolve, reject) => {
    //   reject();
    // });

    // Above line can be rewritten as:
    return Promise.reject();
  }
  return User.findOne({
    '_id':  decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
};



UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject(); // This will be handled by the catch block in the calling function
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};





// Add a Mongoose middleware function to encrypt the password before saving
// it to the database. (cf. search "Mongoose middleware")
UserSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    var password = user.password;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
          if (err){
            next(err);
          }

          user.password = hash;
          next();
      });
    });
  } else {
    next();
  };
});

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
