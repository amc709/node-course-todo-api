const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/user');
//
// var id = '5a776aa4e8b94e29bed9a23d';
//
// if (!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID: ', todo);
// }).catch((e) => console.log(e));

//*************************************************************

var id = '5a766fb8d5429e27d503b23c';

if (!ObjectID.isValid(id)){
  console.log('User ID not valid');
}

User.findById(id).then((user) => {
    if (!user){
      return console.log('User ID not found');
    }
    console.log(JSON.stringify(user, undefined, 2));
  },(err) => {
    console.log(err);
  });
