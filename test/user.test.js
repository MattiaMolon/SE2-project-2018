const fetch = require ('node-fetch');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const root = 'http://localhost:' + PORT + '/users';
const table = 'User';

function setGet(id=''){
  return fetch(root + '/' + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}


function setPost(item, id=''){  
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


// -------------------------------GET-------------------------------
describe('test GET on /users', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('GET all users. Should return an array with all users', () => {
    return setGet()
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json).toBeInstanceOf(Array);
      })
  });

  test('test GET on /users with id found', () => {
    return setGet(1)
      .then(resp => {
        expect(resp.status).toBe(200)
        return resp.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json.id).toEqual(1);
      })
  });

  test('test GET on /users with id not found (123) should return 404', () => {
    return setGet(123)
      .then(resp => {expect(resp.status).toBe(404)});
  });

  test('test GET on /users with id not an integer should return 400', () => {
    return setGet(1.3)
      .then(resp => {expect(resp.status).toBe(400)});
  });

  test('test GET on /users with id equal to a string should return 400', () => {
    return setGet('aa')
      .then(resp => {expect(resp.status).toBe(400)});
  });

  test('test GET on /users with id not found', () => {
    return setGet(99)
      .then(resp => { expect(resp.status).toBe(404)});
  })

  test('test GET on /users with id not found equal to zero', () => {
    return setGet(0)
      .then(resp => { expect(resp.status).toBe(400)});
  })

  test('test GET on /users and database empty should return 404', async ()=>{
    let usr = db.getAll('User');
    await setDelete();

    return setGet()
      .then((resp) => {
        expect(resp.status).toBe(404);
        return resp.json();
      })
      .then( async () => {
        for(let i =0; i< usr.length; i++){
          await setPost(usr[i]);
        }
      })
  })
})

// -------------------------------POST-------------------------------
describe('test POST on /users', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('test POST user with everything OK', () => {
    let body = {
                    // id: 1, 
                    name: 'Piero', 
                    surname: 'Grasso', 
                    uniNumber: 182930, 
                    isTeacher: true, 
                    email: 'piero@gmail.com', 
                    password: 'abc123',
                    examsList: [1,2]
              }
    return setPost(body)
      .then(resp => {
        expect(resp.status).toBe(201);
        return resp.json();
      })
    .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.name).toEqual(body.name);
        expect(json.surname).toEqual(body.surname);
        expect(json.uniNumber).toEqual(body.uniNumber);
        expect(json.isTeacher).toEqual(body.isTeacher);
        expect(json.email).toEqual(body.email);
        expect(json.password).toEqual(body.password);
        expect(json.examsList).toEqual(body.examsList);
      })
  });

  test('test POST user with email equal to null', () => {
    return setPost({
                    // id: 1, 
                    name: 'Piero', 
                    surname: 'Grasso', 
                    uniNumber: 182930, 
                    isTeacher: true, 
                    email: null, 
                    password: 'abc123',
                    examsList: [1,2]
                  })
      .then(resp => {expect(resp.status).toBe(400)});
  });

  test('test POST user with email equal to an integer', () => {
    return setPost({
                    // id: 1, 
                    name: 'Piero', 
                    surname: 'Grasso', 
                    uniNumber: 182930, 
                    isTeacher: true, 
                    email: 2, 
                    password: 'abc123',
                    examsList: [1,2]
                  })
      .then(resp => {expect(resp.status).toBe(400)});
  });

  test('test POST user with not all parameter required passed', () => {
    return setPost({
                    // id: 1, 
                    name: 'Piero', 
                    email: 2, 
                    password: 'abc123',
                    examsList: [1,2]
                  })
      .then(resp => {expect(resp.status).toBe(400)});
  });

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

})

// -------------------------------PUT-------------------------------
describe('test PUT on /users', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('test PUT user with id found', () => {
    let tmp = {
      //id: 1, 
      name: 'AA', 
      surname: 'Grasso', 
      uniNumber: 12345, 
      isTeacher: false, 
      email: 'piero@grasso.it',
      password: 'abc123',
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.name).toEqual(tmp.name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(tmp.uniNumber);
        expect(json.isTeacher).toEqual(tmp.isTeacher);
        expect(json.email).toEqual(tmp.email);
        expect(json.password).toEqual(tmp.password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
  });
  
  
  test('test PUT user with id not found equal to null', () => {
    return setPut({
                    //id: 0, 
                    name: 'AA', 
                    surname: 'Grasso', 
                    uniNumber: 12345, 
                    isTeacher: false, 
                    email: 'piero@grasso.it',
                    password: 'abc123',
                    examsList: [1,2]
                  }, null)
      .then(resp => {expect(resp.status).toBe(400)});
  });
  
  //ok accetta solo valori + 
  test('test PUT user with id negative not found', () => {
    return setPut({
                    //id: 0, 
                    name: 'AA', 
                    surname: 'Grasso', 
                    uniNumber: 12345, 
                    isTeacher: false, 
                    email: 'piero@grasso.it',
                    password: 'abc123',
                    examsList: [1,2]
                  }, -1)
      .then((resp) => {expect(resp.status).toBe(400)});
  });
  
  test('test PUT user with id not found', () => {
    return setPut({
                    //id: 0, 
                    name: 'AA', 
                    surname: 'Grasso', 
                    uniNumber: 12345, 
                    isTeacher: false, 
                    email: 'piero@grasso.it',
                    password: 'abc123',
                    examsList: [1,2]
                  }, 123)
      .then((resp) => {expect(resp.status).toBe(404)});
  });

  test('test PUT users with all parameters passed and id not found', () => {
    return setPut({ 
                  name: 'AA', 
                  surname: 'Grasso', 
                  uniNumber: 12345, 
                  isTeacher: false, 
                  email: 'piero@grasso.it',
                  password: 'abc123',
                  examsList: [1,2]
                }, 99)
        .then( (resp) => {expect(resp.status).toBe(404)});
  })


  test('test PUT user with name equal to null', () => {
    let tmp = {
      //id: 1, 
      name: null, 
      surname: 'Grasso', 
      uniNumber: 12345, 
      isTeacher: false, 
      email: 'piero@grasso.it',
      password: 'abc123',
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(db.getById('User',1).name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(tmp.uniNumber);
        expect(json.isTeacher).toEqual(tmp.isTeacher);
        expect(json.email).toEqual(tmp.email);
        expect(json.password).toEqual(tmp.password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
    });


  test('test PUT user with surname equal to a number', () => {
    return setPut({
                    //id: 1, 
                    name: 'Mario', 
                    surname: 3, 
                    uniNumber: 12345, 
                    isTeacher: false, 
                    email: 'piero@grasso.it',
                    password: 'abc123',
                    examsList: [1,2]
                  }, 1)
      .then(resp => {expect(resp.status).toBe(400)});
  });
 
  test('test PUT user with uniNumber equal to null', () => {
    let tmp = {
      //id: 1, 
      name: 'Mario', 
      surname: 'Grasso', 
      uniNumber: null, 
      isTeacher: false, 
      email: 'piero@grasso.it',
      password: 'abc123',
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.name).toEqual(tmp.name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(db.getById('User',1).uniNumber);
        expect(json.isTeacher).toEqual(tmp.isTeacher);
        expect(json.email).toEqual(tmp.email);
        expect(json.password).toEqual(tmp.password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
  });
  
  test('test PUT ON users with isTeacher equal to null', () => {
    let tmp = {
      //id: 1, 
      name: 'Mario', 
      surname: 'Grasso', 
      uniNumber: 12345, 
      isTeacher: null, 
      email: 'piero@grasso.it',
      password: 'abc123',
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.name).toEqual(tmp.name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(tmp.uniNumber);
        expect(json.isTeacher).toEqual(db.getById('User',1).isTeacher);
        expect(json.email).toEqual(tmp.email);
        expect(json.password).toEqual(tmp.password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
  });
  
  test('test PUT users with email equal to null', () => {
    let tmp = {
      //id: 1, 
      name: 'Mario', 
      surname: 'Grasso', 
      uniNumber: 12345, 
      isTeacher: false, 
      email: null,
      password: 'abc123',
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.name).toEqual(tmp.name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(tmp.uniNumber);
        expect(json.isTeacher).toEqual(tmp.isTeacher);
        expect(json.email).toEqual(db.getById('User',1).email);
        expect(json.password).toEqual(tmp.password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
  });
  
  test('test PUT users with password equal to null', () => {
    let tmp = {
      //id: 1, 
      name: 'Mario', 
      surname: 'Grasso', 
      uniNumber: 12345, 
      isTeacher: false, 
      email: 'piero@grasso.it',
      password: null,
      examsList: [1,2]
    };
    
    return setPut(tmp, 1)
      .then(resp => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.name).toEqual(tmp.name);
        expect(json.surname).toEqual(tmp.surname);
        expect(json.uniNumber).toEqual(tmp.uniNumber);
        expect(json.isTeacher).toEqual(tmp.isTeacher);
        expect(json.email).toEqual(tmp.email);
        expect(json.password).toEqual(db.getById('User',1).password);
        expect(json.examsList).toEqual(tmp.examsList);
      })
  });

  test('test PUT on users with id equal to a string' , () =>{
    return setPut({ name: 'Mario', 
                    surname: 'Grasso', 
                    uniNumber: 12345, 
                    isTeacher: false, 
                    email: 'piero@grasso.it',
                    password: '12345',
                    examsList: [1,2]
                  }, "string")
        .then(resp => {expect(resp.status).toBe(400)});
  })

});


// -------------------------------DELETE-------------------------------
describe('test DELETE on /users', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('test DELETE all users should return 200', () => {
      let usr = db.getAll('User');
      return setDelete() 
        .then((response)=>{ expect(response.status).toBe(200);
          })
        .then(async () => {
          for(let i =0; i< usr.length; i++){
            await setPost(usr[i]);
          }
        })
  });

  test('test DELETE user with id found', () => {
    let usr = db.getById('User', 1); 
    return setDelete(1)
      .then((response)=>{ expect(response.status).toBe(200);})
      .then(async () => {
        await setPost(usr);
      });
  });


  test('test DELETE user with id equal to null', () => {
    let usr = db.getById('User', null);
    return setDelete(usr)
      .then((response)=>{
        expect(response.status).toBe(400);
      });
  });

  test('test DELETE user with id equal to a string', () => {
    let usr = db.getById('User', null);
    return setDelete(usr)
      .then((response)=>{
        expect(response.status).toBe(400);
      });

  });

});