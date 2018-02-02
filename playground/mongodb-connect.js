// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text:  'Pay mortgage',
  //   completed: false
  // }, (err, result) => {
  //   if (err){
  //     return console.log('Unable to insert todo item', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //
  // });

  // db.collection('Users').insertOne({
  //   name: 'Anthony',
  //   age:  35,
  //   location:  'Orlando, FL'
  // }, (err, result) => {
  //   if (err){
  //     return console.log('Unable to insert user', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.close();
});
