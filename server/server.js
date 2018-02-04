var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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


app.listen(3000, () => {
  console.log('Started on port 3000');
});
