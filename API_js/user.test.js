const app = require('./user').app;
const urlUsers = "http://localhost:3000/users";
const fetch = require('node-fetch');

const request = require('supertest');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

// test('GET /users should return 200 and return the list of all the users', () => {
//     return fetch(urlUsers)
//         .then(r => expect(r.status).toEqual(200));
// });

// // probabilmente questa non serve perchè in get di users c'è solo res.status(200)
// // test('GET /users should return 404 if there is no user found', () => {
// //     return fetch(urlUsers)
// //         .then(r => expect(r.status).toEqual(404));
// // });

// test('GET /users/{usersId} should return 200 and return the specified user', () => {
//     var url = urlUsers+'/1';
//     return fetch(url)
//         .then(r => r.json())
//         .then( usersList => {
//             expect(usersList[1]).toEqual({
//                 "id": 1, 
//                 "name": 'Piero', 
//                 "surname": 'Grasso', 
//                 "uniNumber": 182930, 
//                 "isTeacher": true, 
//                 "email": 'piero@grasso.it', 
//                 "password": 'abc123',
//                 "examsList": ['Logic', 'Math']
//             })
//         }) 
//         .then(r => {
//             console.log(store, r)
//         })
// });

// test('GET /users should return 200 and return the list of all the users', (done) => {
//     req(app)
//         .get('/api/v1/users')
//         .expect(200)
//         .end((err, res) => {
//             if(err && res.error){
//                 console.log('res.error');
//             }
//             done(err);
//         });
// });