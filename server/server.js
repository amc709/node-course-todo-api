var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// Needed to enable application to be deployed to Heroku.
// Get PORT created by Heroku as an environment variable; if none exists,
// default to 3000.
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());


app.post('/todos', (req, resp) => {
  console.log(req.body);

  var todo = new Todo({
    text:  req.body.text
  });

  todo.save().then((doc) => {
    resp.send(doc);
  }, (err) => {
    console.log('Unable to save todo: ', err);
    resp.status(400).send(err);
  });
});


app.get('/todos', (req, resp) => {
  Todo.find().then((todos) => {
    resp.send({todos});    // Return todos array as an object
  }, (err) => {
    resp.status(400).send(err);
  });
});


// GET /todos/1231434
app.get('/todos/:id', (req, resp) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return resp.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo){
      return resp.status(404).send();
    }
    resp.send({todo});

  }).catch((err) => {
    resp.status(400).send({});
  });
}) ;


// DELETE /todos/:id
app.delete('/todos/:id', (req,res) => {
  // get the id
  var id = req.params.id;

  // validate the id -> not valid, return 404
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  // Valid ID; proceed to remove the document
  Todo.findByIdAndRemove(id).then((todoDoc) => {
    if (!todoDoc){
      return res.status(404).send();
    }
    return res.status(200).send(todoDoc);
  }, (err) => {  // or use same catch block as in previous route code
    return res.status(400).send();
  });
  // remove todo by id
    //success
      // if no doc, send 404
      // if doc, send doc back with 200
    // error
      // 400 with empty body
});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
