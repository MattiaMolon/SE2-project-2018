const app = require('./app').app
const url = 'http://localhost:3000/exams'
const fetch = require('node-fetch');


it('path /exams with GET', () => {
    return fetch(url) 
    .then(r => expect(r.status).toEqual(200))
});



// it('works with post', () => {
//        // expect.assertions(1);
//         return fetch(url, {
//             method: 'POST',
//                 body: JSON({id: 3, taskgroup: 3, startline: 3, deadline: 3, classes: 3}),
//                 headers: {
//                 'Content-Type': 'application/json',
//                 },
//             })
//             //.then(r => r.json())
//             .then(r => expect(r.status).toEqual(201));
// });




