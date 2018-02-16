const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id:  userOneId, //new ObjectID(),
    email: 'anthony@example.com',
    password:  'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
  }, {
    _id: userTwoId,
    email: 'liza@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
  }
];

/*
  Instead of clearing the database before running the tests, we will populate
  the database with some seed data using the array below.
*/
const todos = [{
  _id: new ObjectID(),      // Added for testing GET /todos/:id
  text: 'First test todo',
  _creator: userOneId
},{
  _id: new ObjectID(),      // Added for testing GET /todos/:id
  text: 'Second test todo',
  completed: true,
  completedAt: 12345,
  _creator:  userTwoId
}];


const populateTodos =(done) => {
  // Todo.remove({}).then(() => done());

  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);  // Insert seed data into collection
  }).then(() => done());
};

const populateUsers = (done) =>{
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    Promise.all([userOne, userTwo]);
  }).then(() => done());
};


module.exports = {todos, populateTodos, users, populateUsers};
