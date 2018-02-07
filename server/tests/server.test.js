const expect = require('expect');
const request = require('supertest');

// This was added for testing GET /todos/:id
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

/*
  TO RUN THE TEST IN COMMAND LINE:
      npm run test-watch
  NOTE:  test-watch should be added as a script in package.json
*/

/*
  Instead of clearing the database before running the tests, we will populate
  the database with some seed data using the array below.
*/
const todos = [{
  _id: new ObjectID(),      // Added for testing GET /todos/:id
  text: 'First test todo'
},{
  _id: new ObjectID(),      // Added for testing GET /todos/:id
  text: 'Second test todo'
}];

// This wipes out the Todos database content before
// running this test.  This ensures that after the post behavior successfully
// adds the todo item in the database, there will only be one item in
// that collection.
beforeEach((done) => {
  // Todo.remove({}).then(() => done());

  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);  // Insert seed data into collection
  }).then(() => done());
});

// POST Tests
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Clean house';

    request (app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((resp) => {
        expect(resp.body.text).toBe(text);
      })
      .end((err, resp) => {
        if (err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);

          console.log(JSON.stringify(todos, undefined, 2));
          done();
        }).catch((err) => done(err));

        console.log('Done with first test');
      });
  });

// beforeEach((done) => {
//   Todo.remove({}).then(()=> done());
// });

  it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, resp) => {
          if (err){
            return done(err);
          }

          Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            done();
          }).catch((err) => done(err));
        });
  });

});


// GET tests
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

});


// GET /todos/:id
describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var temp = new ObjectID();
    request(app)
      .get(`/todos/${temp.toHexString()}`)
      .expect(404)
      .end(done);
  });


  it ('should return 404 for non-object ids', (done) =>{
    // /todos/123
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

// DELETE /todos/:id
describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todoDoc._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        // query database using findById -> toNotExist
        Todo.findById(hexId).then((result) => {
          expect(result).toNotExist();
          done();
        }).catch((err) => done(err));
      })
  });


  it('should return 404 if todo not found', (done) => {
    var temp = new ObjectID();
    request(app)
      .delete(`/todos/${temp.toHexString()}`)
      .expect(404)
      .end(done);
  });


  it ('should return 404 if object ID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});
