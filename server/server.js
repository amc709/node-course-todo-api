require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

// Needed to enable application to be deployed to Heroku.
// Get PORT created by Heroku as an environment variable; if none exists,
// default to 3000.
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());


app.post('/todos', authenticate,(req, resp) => {
  console.log(req.body);

  var todo = new Todo({
    text:  req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    resp.send(doc);
  }, (err) => {
    console.log('Unable to save todo: ', err);
    resp.status(400).send(err);
  });
});


app.get('/todos', authenticate, (req, resp) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    resp.send({todos});    // Return todos array as an object
  }, (err) => {
    resp.status(400).send(err);
  });
});


// GET /todos/1231434
app.get('/todos/:id', authenticate,(req, resp) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return resp.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo){
      return resp.status(404).send();
    }
    resp.send({todo});

  }).catch((err) => {
    resp.status(400).send({});
  });
}) ;


// DELETE /todos/:id
app.delete('/todos/:id', authenticate, (req,res) => {
  // get the id
  var id = req.params.id;

  // validate the id -> not valid, return 404
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  // Valid ID; proceed to remove the document
  // remove todo by id
    //success
      // if no doc, send 404
      // if doc, send doc back with 200
    // error
      // 400 with empty body
  Todo.findOneAndRemove({
    _id:  id,
    _creator:  req.user._id
  }).then((todoDoc) => {
    if (!todoDoc){
      return res.status(404).send();
    }
    return res.status(200).send({todoDoc});
  }, (err) => {  // or use same catch block as in previous route code
    return res.status(400).send();
  });

});


// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  // The pick function allows you to specify a subset of the items
  // sent by the user in the request.  Eg. Even if user sends a value before
  // completedAt, it won't be used because the application (not the user)
  // will set the value for it.
  var body = _.pick(req.body, ['text','completed']);

  // validate the id -> not valid, return 404
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  // Check the 'completed' value; if true, set completedAt with a timestamp
  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();  // milliseconds from midnight 1/1/1970
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  });
});



// POST /users  -  Add user to database
// Pick email, password
app.post('/users', (req, resp)=>{
  var body = _.pick(req.body, ['email', 'password']);
  // var user = new User({
  //   email: body.email,
  //   password: body.password
  // });

  // Another way to write the previous line
  var user = new User(body);

  // user.save().then((doc) => {
  //   console.log(`Saved user: ${doc}`);
  //   resp.status(200).send({doc});
  // }, (err) =>{
  //   console.log(`Unable to save user:  ${err}`);
  //   resp.status(400).send(err);
  // });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    resp.header('x-auth', token).send(user);
  }).catch ((err) => {
    resp.status(400).send(err);
  });
});




app.get('/users/me', authenticate, (req, res) => {
  // var token = req.header('x-auth');
  //
  // User.findByToken(token).then((user) => {
  //   if (!user){
  //     return Promise.reject();
  //   }
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(401).send();
  // });

  res.send(req.user);
});


// User login
// POST /users/login  -> pass on {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) =>{
      res.header('x-auth', token).send(user);
    });
  }). catch((e) => {
    res.status(400).send();
  });

});


// Log out user
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});


module.exports = {app};
