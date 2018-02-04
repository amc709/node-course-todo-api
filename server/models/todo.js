const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newTodo = new Todo({
//   text: 'Clean the house'
// });
//
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo: ', doc);
// }, (err) => {
//   console.log('Unable to save todo', err);
// });


module.exports = {Todo};
