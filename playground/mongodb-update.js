// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a74f3a84058bcc8a56e108f')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });


  db.collection('Users').findOneAndUpdate(
    {
      _id: new ObjectID('5a73d19eac30a532410e6fea')
    }, {
      $set: {
        name: 'Anthony'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }
  ).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  });






  // db.close();
});
