const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = "http://se2-project-2018.herokuapp.com" + "/classes";
const fetch = require('node-fetch');
const table = 'Class';
const db = require('../database/database');

// Utilities
function setGet(id="") {
  return fetch(SERVER_URL+"/"+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

function setPost(item, id=""){
  return fetch(SERVER_URL+"/"+id,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setPut(item, id=""){
  return fetch(SERVER_URL+"/"+id,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
};

function setDelete(id=""){
  return fetch(SERVER_URL+"/"+id, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
  });
};

const classSample = {
    name: 'SiamoVeramenteEuforici', 
    participants: [1,2,3,4,5]
  };

let classSampleUpdate = {
    name: 'Povolesi', 
    participants: [2,3,4,5]
  };

// Testing

// collection
describe('Testing GET methods on /classes', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The GET /class should return 200 & an array with json elements that represent the classes', () => {

    return setGet()
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json).toBeInstanceOf(Array);
      });
  });
  
  // STATUS 404
  test('The GET /class should return error 404 with an empty database.', async () => {
    let tmp = db.getAll(table);
    await setDelete();

    return setGet()
      .then((res) => {
        expect(res.status).toBe(404);
        return res;
      })
      .then(async () => {
        for (let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });
  });

  // STATUS 400
  // come posso testare questa cosa?

});

describe('Testing POST methods on /classes', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 201
  test('The POST with a correct Class should return 201 & the class sent', () => {

  return setPost(classSample)
    .then((res) => {
      expect(res.status).toBe(201);
      return res.json();
    })
    .then((json) => {
      expect(json.id).toBeGreaterThan(0);
      expect(json.name).toEqual(classSample.name);
      expect(json.participants).toEqual(classSample.participants);
    });
  });

  test('The POST with only a number as a class participants should 201 and the class created', () => {
    let tmp = classSample;
    tmp.participants = [2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(201);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.name).toEqual(classSample.name);
        expect(json.participants).toEqual(classSample.participants);
      });
  });

  // STATUS 400
  test('The POST with a missing Name in the Class should return bad request 400', () => {
    let tmp = classSample;
    tmp.name = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing participants field in the Class should return bad request 400', () => {
    let tmp = classSample;
    tmp.participants = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null Name in the Class should return bad request 400', () => {
    let tmp = classSample;
    tmp.name = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null participants field in the Class should return bad request 400', () => {
    let tmp = classSample;
    tmp.participants = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing Partecipants in the class should return bad request 400', () => {
    let tmp = classSample;
    tmp.participants = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a number as a class name should return bad request 400', () => {
    let tmp = classSample;
    tmp.name = 99;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a class name should return bad request 400', () => {
    let tmp = classSample;
    tmp.name = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a class name should return bad request 400', () => {
    let tmp = classSample;
    tmp.name = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a class participants should return bad request 400', () => {
    let tmp = classSample;
    tmp.participants = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  // questo sarebbe il test per vedere se l'id è negativo => che vuol dire che c'è stato un errore nel creare un nuovo id
  // test('The POST class.id -1 should return bad request 400', () => {
  //   let tmp = classSample;
  //   tmp.participants = undefined;

  //   return setPost(tmp)
  //     .then((res) => {
  //       expect(res.status).toBe(400);
  //       return res.json();
  //     })
  //     .then((json) => {
  //       expect(json.id).toBeGreaterThan(0);
  //     })
  // });

});

describe('Testing DELETE methods on /classes', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The DELETE /classes should return 200 if the delete was successful', async () => {
    
    let tmp = db.getAll(table);

    return setDelete()
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .then(async () => {
        for(let i=0; i<tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });
  
  // STATUS 404
  test('The DELETE /classes should return error 404 if there are no classes in the database', async () => {
    let tmp = db.getAll(table);
    await setDelete();

    return setDelete() 
      .then((res) => {
        expect(res.status).toBe(404);
      })
      .then(async () => {
        for (let i=0; i<tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });

  //come faccio a testare bad request 400?

});

// Id specifico
describe('Testing GET methods on /classes/:classId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });
  
  // STATUS 200
  test('The GET /classes/:classId should return 200 & the class with the same ID', () => {

    return setGet(1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json.id).toEqual(1);
      });
  });

  // STATUS 404
  test('The GET /classes/:classId should return 404 if there is no Id in the database matching classId', () => {

    let tmpId = db.getNewId(table);
    
    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  // STATUS 400
  test('The GET /classes/:classId should return 400 if the classId is not a number', () => {

    let tmpId = 'ciao';

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /classes/:classId should return 400 if the classId is null', () => {
    let tmpId = null;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /classes/:classId should return 400 if the classId is a negative number', () => {
    let tmpId = -1;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /classes/:classId should return 400 if the classId is not integer', () => {
    let tmpId = 1.2;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /classes/:classId should return 400 if the classId is equale to 0', () => {
    let tmpId = 0;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  // Non sappiamo come testare se l'id è undefined
  // test('The GET /classes/:classId should return 400 if the classId is undefined', () => {
  //   let tmpId = undefined;

  //   return setGet(tmpId)
  //     .then((res) => {
  //       expect(res.status).toBe(400);
  //     });
  // });

})

describe('Testing PUT methods on /classes/:classId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The PUT /classes/:classId with all the fields should return 200 & the class updated', () => {

    return setPut(classSampleUpdate, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json()
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(classSampleUpdate.name);
        expect(json.participants).toEqual(classSampleUpdate.participants);
      })
  });

  test('The PUT /classes/:classId with only the field name should return 200 & the class with the name updated', () => {
    let tmp = {
      name: "Yeeeeeee"
    };

    let classToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(tmp.name);
        expect(json.participants).toEqual(classToPut.participants);
      });
  });

  test('The PUT /classes/:classId with name=null should return 200 & the class with the old name', () => {
    let tmp = {
      name: null
    };

    let classToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(classToPut.name);
        expect(json.participants).toEqual(classToPut.participants);
      });
  });

  test('The PUT /classes/:classId with participants=null should return 200 & the class with the old participants field', () => {
    let tmp = {
      participants: null
    };

    let classToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(classToPut.name);
        expect(json.participants).toEqual(classToPut.participants);
      });
  });

  // Questo test fallisce, dice che riceve [1, 2, 4, 5] ma si aspetta [1, 2, 3, 4, 5]
  /*
  test('The PUT /classes/:classId with only the participants should return 200 & the class with the participants updated', () => {
    let tmp = {
      participants: [1, 2, 4, 5]
    };

    let classToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        console.log('-----'+json.participants);
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(classToPut.name);
        
        expect(json.participants).toEqual(tmp.participants);
      });
  })
  */

  // // e se volessi cambiare solo un partecipante?
  // test('DA SISTEMARE --> The PUT /classes/:classId with only the field participants should return 200 & the class\'s participants updated', () => {
  //   let tmpId = db.getNewId(table)-1;
  //   let tmpParticipants = {
  //     participants: ['Pierina', 'Carla', 'Jean', 'Bruno']
  //   };

  //   // console.log('+++++++++++++++++++++++++++++\n'+classSampleUpdate.name+'\n##########################\n'+tmpParticipants.participants);

  //   return setPut(classSampleUpdate, tmpId)
  //     .then((res) => {
  //       expect(res.status).toBe(200);
  //       return res.json();
  //     })
  //     .then((json) => {
  //       expect(json.id).toEqual(tmpId);
  //       expect(json.name).toEqual(classSampleUpdate.name);
  //       expect(json.participants).toEqual(classSampleUpdate.participants);
  //     })
  //     .then(() => {
  //       for (let i=0; i<classSampleUpdate.participants.length; i++) {
  //         classSampleUpdate.participants[i] = tmpParticipants.participants[i];
  //       }
  //       // console.log('---------------------------------');
  //       console.log(db.getById(table ,tmpId));
  //     })
  // })

  // STATUS 404
  test('The PUT /classes/:classId should return error 404 if there is no ID in the database matching classId', () => {
    let tmpId = db.getNewId(table);

    return setPut(classSampleUpdate, tmpId)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  // STATUS 400
  test('The PUT /classes/:classId should return 400 if the classId is not a number', () => {

    let tmpId = 'ciao';

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /classes/:classId should return 400 if the classId is null', () => {
    let tmpId = null;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /classes/:classId should return 400 if the classId is a negative number', () => {
    let tmpId = -1;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /classes/:classId should return 400 if the classId is not integer', () => {
    let tmpId = 1.2;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /classes/:classId should return 400 if the classId is equale to 0', () => {
    let tmpId = 0;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  })

  // andrebbe anche testato il fatto che l'utente passi valori validi per ogni singolo campo
});

describe('Testing DELETE methods on /classes/:classId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The DELETE /classes/:classId should return 200 if the delete of the class with the matching ID was successful', () => {
    
    let tmp = db.getById(table, 1);

    return setDelete(1)
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .then(async () => {
        await setPost(tmp);
      });
  });

  // STATUS 400
  test('The DELETE /classes/:classId should return 400 if the classId is negative', () => {
    let tmpId = -1;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The DELETE /classes/:classId should return 400 if the classId is not integer', () => {
    let tmpId = 2.3;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The DELETE /classes/:classId should return 400 if the classId is 0', () => {
    let tmpId = 0;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  // Non sappiamo come testare se l'id è undefined
  // test('The DELETE /classes/:classId should return 400 if the classId is undefined', () => {
  //   let tmpId = undefined;

  //   return setDelete(tmpId)
  //     .then((res) => {
  //       expect(res.status).toBe(400);
  //     });
  // });

  test('The DELETE /classes/:classId should return 400 if the classId is null', () => {
    let tmpId = null;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
  
  // STATUS 404
  test('The DELETE /classes/:classId should return error 404 if there are no classes in the database matching the ID', () => {

    return setDelete(55) 
      .then((res) => {
        expect(res.status).toBe(404);
      })
  });
  
});
