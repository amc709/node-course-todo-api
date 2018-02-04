const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

/*
  TO RUN THE TEST IN COMMAND LINE:
      npm run test-watch
  NOTE:  test-watch should be added as a script in package.json
*/

// This wipes out the Todos database content before
// running this test.  This ensures that after the post behavior successfully
// adds the todo item in the database, there will only be one item in
// that collection.
beforeEach((done) => {
  Todo.remove({}).then(() => done());
});


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

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
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
            expect(todos.length).toBe(0);
            done();
          }).catch((err) => done(err));
        });
  });

});
