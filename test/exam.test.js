const fetch = require ('node-fetch');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const root = 'http://localhost:' + PORT + '/exams';
const app = require('../v1/user');


//per testare fai npm test nomefiledaTestare.js
//se non voglio testare tutti quelli nella cartella


function setGet(id=''){
  return fetch(root + '/' + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}


function setPost(item, id=''){ //se passo id prende quello altrimenti prende ' ' 
  return fetch(root + '/' + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
}


function setPut(item, id=''){
  return fetch(root + '/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
}


function setDelete(id=''){
  return fetch(root + '/' + id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });
}



//divide in paragrafi



  test('post su exam', () => {
    return setPost({
      
                  //id:1, 
                  taskgroup: 2, 
                  startline: 24, 
                  deadline: 30, 
                  classes: [1,2],
                  teacher: 1
              
                  })
      .then(resp => {expect(resp.status).toBe(200)});
  });


/*
test('test POST user with uniNumber equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: 'Piero', 
                  surname: 'Grasso', 
                  uniNumber: null, 
                  isTeacher: true, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});


test('test POST user with password equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: 'Piero', 
                  surname: 'Grasso', 
                  uniNumber: 182930, 
                  isTeacher: true, 
                  email: 'piero@grasso.it',
                  password: null,
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});

test('test POST user with name equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: null, 
                  surname: 'Grasso', 
                  uniNumber: 12345, 
                  isTeacher: true, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});


test('test POST user with surname equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: 'Mario', 
                  surname: null, 
                  uniNumber: 12345, 
                  isTeacher: true, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});

test('test POST user with isTeacher equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: 'Mario', 
                  surname: 'Grasso', 
                  uniNumber: 12345, 
                  isTeacher: null, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});


test('test POST user with name and surname equal to null', () => {
	return setPost({
                  // id: 1, 
                  name: null, 
                  surname: null, 
                  uniNumber: 12345, 
                  isTeacher: false, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                })
		.then(resp => {expect(resp.status).toBe(400)});
});
*/


