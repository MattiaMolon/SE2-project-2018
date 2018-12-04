
//bisogna sistemare tutte le cose, perchè questa è class

const app = require('../v1/user');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const urlUsers = "http://localhost:"+PORT+"/users";
const fetch = require('node-fetch');
const tableUser = 'User';

// Utilities

function setGet(id="") {
  return fetch(urlUsers+"/"+id,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
};

function setPost(item, id=""){
  return fetch(urlUsers+"/"+id,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setPut(item, id=""){
  return fetch(urlUsers+"/"+id,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setDelete(id=""){
  return fetch(urlUsers+"/"+id, {
      method: 'DELETE',
      headers:{
        'Accept': 'application/json'
      }
  });
};

const userSample = {
    id: 1, 
    name: 'Piero', 
    surname: 'Grasso', 
    uniNumber: 182930, 
    isTeacher: true, 
    email: 'piero@grasso.it', 
    password: 'abc123',
    examsList: [1,2]
  };

let userSampleUpdate = {
    id: 1, 
    name: 'Giovanni', 
    surname: 'Grasso', 
    uniNumber: 182930, 
    isTeacher: false, 
    email: 'giovanni@grasso.it', 
    password: 'abc123',
    examsList: [1,2]
  };

// Testing

describe('App method should be defined', () => {
  test('app module should be defined', () => {
    expect(app).toBeDefined();
  });
})

describe('Testing GET methods on /users', () => {

  test('The GET /users should return 200 & an array with json elements that represent the users', () => {
    
    return setGet()
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json).toBeInstanceOf(Array);
      });
  })

  test('The GET /users should return error 404 with an empty database.', () => {
    let tmp = db.getAll(tableUser);
    db.deleteAll(tableUser);

    return setGet()
      .then((res) => {
        expect(res.status).toBe(404);
      })
      .then(() => {
        for (let i = 0; i<tmp.length; i++){
          db.addItem(tableUser, tmp[i]);
        }
      });
  });

});

describe('Testing POST methods on /users', () => {

  test('The POST with a correct User should return 201 & user sent', () => {

    return setPost(userSample)
      .then((res) => {
        expect(res.status).toBe(201);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.name).toEqual(userSample.name);
        expect(json.surname).toEqual(userSample.surname);
        expect(json.uniNumber).toEqual(userSample.uniNumber);
        expect(json.isTeacher).toEqual(userSample.isTeacher);
        expect(json.email).toEqual(userSample.email);
        expect(json.password).toEqual(userSample.password);
        expect(json.examsList).toEqual(userSample.examsList);
      });
  });

});

describe('Testing DELETE methods on /users', () => {

  test('The DELETE /users should return 200', () => {
    
    let tmp = db.getAll(tableUser);

    return setDelete()
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .then(() => {
        for(let i=0; i<tmp.length; i++) {
          db.addItem(tableUser, tmp[i]);
        }
      });
  });

});

describe('Testing GET methods on /users/:userId', () => {
  
  test('The GET /users/:userId should return 200 & the user with the same ID', () => {

    return setGet(1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json.id).toEqual(1);
      })
  })
})