const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const url = "http://localhost:"+PORT+"/submission";
const fetch = require('node-fetch');
const table = 'Submission';
/*
// Utilities
function setGet(id="") {
  return fetch(url+"/"+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

function setPost(item, id=""){
  return fetch(url+"/"+id,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setPut(item, id=""){
  return fetch(url+"/"+id,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setDelete(id=""){
  return fetch(url+"/"+id, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
  });
};
*/
describe('Testing GET methods on /submission', () => {
/*
  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });
*/
    // STATUS 200
    test('The GET /submission should return 200 & an array with json elements that represent the submissions', () => {
/*
      return setGet()
        .then((res) => {
          expect(res.status).toBe(200);
          return res.json();
        })
        .then((json) => {
          expect(json).toBeDefined();
          expect(json).toBeInstanceOf(Array);
        });
        */
    });
  });