const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email:  {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

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
