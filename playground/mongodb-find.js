// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //     // completed: false
  //     // _id: '5a73cd1bac30a532410e6ea1'  // does not work
  //     _id: new ObjectID('5a73cd1bac30a532410e6ea1')
  //   }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to get todos from the database');
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count:  ${count}`);
  // }, (err) => {
  //   console.log('Unable to get todos from the database');
  // });


  db.collection('Users').find({name: 'Anthony'}).toArray().then((docs)=>{
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) =>{
    console.log('Unable to access Users data')
  });


  // db.close();
});
