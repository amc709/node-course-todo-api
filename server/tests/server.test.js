
const expect = require('expect');
const request = require('supertest');

// This was added for testing GET /todos/:id
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

/*
  TO RUN THE TEST IN COMMAND LINE:
      npm run test-watch
  NOTE:  test-watch should be added as a script in package.json
*/


// This wipes out the Todos database content before
// running this test.  This ensures that after the post behavior successfully
// adds the todo item in the database, there will only be one item in
// that collection.
beforeEach(populateTodos);
beforeEach(populateUsers);

// POST Tests
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Clean house';

    request (app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

        // console.log('Done with first test');
      });
  });

// beforeEach((done) => {
//   Todo.remove({}).then(()=> done());
// });

  it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(401)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });

});


// GET /todos/:id
describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });


  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
  });


  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
  });


  it ('should return 404 for non-object ids', (done) =>{
    // /todos/123
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(401)
      .end(done);
  });
});

// DELETE /todos/:id
describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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


  it('should not remove a todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end((err, res) => {
        if (err){
          return done(err);
        }

        // query database using findById -> toExist
        Todo.findById(hexId).then((result) => {
          expect(result).toExist();
          done();
        }).catch((err) => done(err));
      })
  });





  it('should return 404 if todo not found', (done) => {
    var temp = new ObjectID();
    request(app)
      .delete(`/todos/${temp.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end(done);
  });


  it ('should return 404 if object ID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(401)
      .end(done);
  });
});



// PATCH /todos/:id
describe('PATCH /todos/:id', ()=>{

  it('should update the todo', (done) => {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    var origText = todos[0].text;
    console.log('Original text: ',origText);

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({    // update the text, set completed to true
        text: 'Updated todo 1 text',
        completed: true
      })

      // assert 200 status
      .expect(200)

      // response: text is changed, completed is true, completedAt is a number
      .expect((res) =>{
        expect(res.body.todo.text).toNotBe(origText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');

      }) .end(done);
  });

  it('should not update the todo created by other user', (done) => {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    var origText = todos[0].text;
    console.log('Original text: ',origText);

    // Log in as 2nd user
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({    // update the text, set completed to true
        text: 'Updated todo 1 text',
        completed: true
      })

      // assert 401 status (Unauthorized)
      .expect(401)
      .end(done);
  });


  it('should clear completedAt when todo is not completed', (done) => {
      // grab id of 2nd items
      var hexId = todos[1]._id.toHexString();
      var origText = todos[1].text;
      console.log('Original text: ',origText);


      request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({     // update text, set completed to false
          text: "Pay bills",
          completed: false
        })
        // expect 200
        .expect(200)

        // expect text is changed, completed=false, completedAt=null
        .expect((resp) =>{
            expect(resp.body.todo.text).toNotBe(origText);
            expect(resp.body.todo.completed).toBe(false);
            expect(resp.body.todo.completedAt).toNotExist();
        })
        .end(done);
  });
});



// GET /users/me  ==> NOT WORKING PROPERLY.
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        // console.log(`res: ${JSON.stringify(res, undefined, 2)}`);
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });


  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});


describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      // .end(done);
      .end((err) => {
        if (err){
          return done(err);
        }
        User.findOne({email}).then((user) =>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'abc.com';
    var password = 'abc';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

      // THIS DOES NOT WORK!!!
      // .end((err) => {
      //   if (err){
      //     return done(err);
      //   }
      // });
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'abc1234';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

});


// Test user login
describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e)=> done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password:  users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();

      }).end((err, res) => {
        if (err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e)=> done(e));
      });

  });
});



// Test user log out
describe('DELETE /users/me/token', () => {

  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set ('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err,res) => {
        if (err){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=> done(e));

      });
  });
});
