const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');


// Remove all from the collection
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove();
Todo.findOneAndRemove({_id: '5a7a61104058bcc8a56e8740'}).then((todoDoc) => {
  console.log(todoDoc);
});


// Todo.findByIdAndRemove();
Todo.findByIdAndRemove('5a7a61104058bcc8a56e8740').then((todoDoc) => {
  console.log(todoDoc);
});
