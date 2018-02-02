// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Buy groceries'}).then((result) =>{
  //   console.log(result);
  // });

  // deleteOne
// db.collection('Todos').deleteOne({text: 'Buy groceries'}).then((result) => {
//   console.log(result);
// });


  // findOneAndDelete
// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });


  // db.collection('Users').deleteMany({name: 'Sam'}).then((result) => {
  //   console.log(`After deleting many:  ${result}`);
  // });

db.collection('Users').findOneAndDelete(
  {
    _id: new ObjectID('5a6fd588524f3b226327dec2')
  }).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
});


  // db.close();
});
