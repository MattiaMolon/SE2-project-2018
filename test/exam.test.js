const fetch = require('node-fetch');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/exams';
const db = require('../database/database')
const table = 'Exam';

const examSample = {
  taskgroup: 1,
  startline: '04/12/2018 09:00',
  deadline: '04/12/2018 11:00',
  classes: 2,
  teacher: 3
}

const examUpdate = {
  taskgroup: 2,
  startline: '04/12/2018 09:00',
  deadline: '04/12/2018 11:00',
  classes: 3,
  teacher: 1
}

// UTILS
function setGet(id='') {
  return fetch(SERVER_URL + '/' + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
}

function setPost(item, id=""){
  return fetch(SERVER_URL+"/"+id,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
}

function setDelete(id=""){
  return fetch(SERVER_URL+"/"+id, {
      method: 'DELETE',
      headers:{
        'Accept': 'application/json'
      }
  });
}

function setPut(item, id=""){
  return fetch(SERVER_URL+"/"+id,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(item)
  });
}

// TESTS


describe('testing GET on /exams', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });
  
  test('the GET should return an array with json elements', () => {
    return setGet()
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json).toBeInstanceOf(Array);
      });
  });

  test('the GET with an empty database should return 404', async () => {
    let tmp = db.getAll('Exam');
    await setDelete();

    return setGet()
      .then((response) => {
        expect(response.status).toBe(404);
      })
      .then(async () => {
        for(let i = 0; i < tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });
});

describe('testing POST on /exam', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });
  

    test('the POST with a correct exam should return 201 and the json of the created exam', () => {
      return setPost(examSample)
        .then((response) => {
          expect(response.status).toBe(201);
          return response.json();
        })
        .then((json) => {
          expect(json.id).toBeGreaterThan(0);
          expect(json.taskgroup).toEqual(examSample.taskgroup);
          expect(json.startline).toEqual(examSample.startline);
          expect(json.deadline).toEqual(examSample.deadline);
          expect(json.classes).toEqual(json.classes);
          expect(json.teacher).toEqual(json.teacher);
        });
    });

    test('the POST without taskgroup should return 400', () => {
      let tmp = examSample;
      tmp.taskgroup = null;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });

    test('the POST without deadline should return 400', () => {
      let tmp = examSample;
      tmp.deadline = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        });
    });

    test('the POST without classes should return 400', () => {
      let tmp = examSample;
      tmp.classes = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });

    test('the POST without teacher should return 400', () => {
      let tmp = examSample;
      tmp.teacher = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });
});

describe('testing DELETE on /exam', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('the DELETE should return 200', () => {
    let tmp = db.getAll('Exam');
    
    return setDelete()
      .then((response) => {
        expect(response.status).toBe(200);
      })
      .then(async () => {
        for(let i = 0; i < tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });

  test('the DELETE with an empty database set should return 404', async () => {
    let tmp = db.getAll('Exam');
    await setDelete();

    return setDelete()
      .then((response) => {
        expect(response.status).toBe(404);
      })
      .then(async () => {
        for(let i = 0; i < tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });
});

describe('testing GET on /exam/:examId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('the GET with a valid examId should return 200 and the correct exam', () => {
    return setGet(1)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json).toBeDefined();
        expect(json.id).toEqual(1);
      });
  });

  test('the GET with a NaN ID should return 400', () => {
    return setGet('ciao')
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  test('the GET with a ID == null should return 400', () => {
    let temp = null;
    return setGet(temp)
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  test('the GET with a ID < 0 should return 400', () => {
    return setGet(-2)
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  test('the GET with a ID == 0 should return 400', () => {
    return setGet(0)
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  test('the GET with a not Integer ID should return 400', () => {
    return setGet(1.53)
      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  test('the GET with a non existing ID should return 404', () => {
    let tmp = db.getNewId('Exam');
    return setGet(tmp)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});

describe('testing PUT on /exams/:examId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('the PUT with a Nan ID should return 400', () => {
    return setPut(examUpdate, 'ciao')
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the PUT with a ID == null should return 400', () => {
    let tmp = null;
    return setPut(examUpdate, tmp)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the PUT with a ID < 0 should return 400', () => {
    return setPut(examUpdate, -2)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the PUT with a ID == 0 should return 400', () => {
    return setPut(examUpdate, 0)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the PUT with a not Integer ID should return 400', () => {
    return setPut(examUpdate, 1.54)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the PUT with a not existing ID should return 404', () => {
    let tmp = db.getNewId('Exam');
    return setPut(examUpdate, tmp)
      .then((response) => {
        expect(response.status).toBe(404);
      })
  });

  test('the PUT with all the correct fields should return 200', () => {
    let tmp = db.getAll('Exam');
    let tmp_id = tmp[tmp.length - 1].id;

    return setPut(examUpdate, tmp_id)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(tmp_id);
        expect(json.taskgroup).toEqual(examUpdate.taskgroup);
        expect(json.startline).toEqual(examUpdate.startline);
        expect(json.deadline).toEqual(examUpdate.deadline);
        expect(json.classes).toEqual(examUpdate.classes);
        expect(json.teacher).toEqual(examUpdate.teacher);
      })
  });

  test('the PUT with only the taskgroup updated should return 200 with the exam update with the new taskgroup', () => {
    let tmp = {
      taskgroup: 5
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(2);
        expect(json.taskgroup).toEqual(tmp.taskgroup);
        expect(json.startline).toEqual(json.startline);
        expect(json.deadline).toEqual(json.deadline);
        expect(json.classes).toEqual(json.classes);
        expect(json.teacher).toEqual(json.teacher);
      })
  });

  test('the PUT with only the deadline updated should return 200 with the exam update with the new deadline', () => {
    let tmp = {
      deadline: '25/12/2018 23:59'
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(2);
        expect(json.taskgroup).toEqual(json.taskgroup);
        expect(json.startline).toEqual(json.startline);
        expect(json.deadline).toEqual(tmp.deadline);
        expect(json.classes).toEqual(json.classes);
        expect(json.teacher).toEqual(json.teacher);
      })
  });

  test('the PUT with only the classes updated should return 200 with the exam update with the new classes', () => {
    let tmp = {
      classes: [1, 3]
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(2);
        expect(json.taskgroup).toEqual(json.taskgroup);
        expect(json.startline).toEqual(json.startline);
        expect(json.deadline).toEqual(json.deadline);
        expect(json.classes).toEqual(tmp.classes);
        expect(json.teacher).toEqual(json.teacher);
      })
  });

  test('the PUT with only the teacher updated should return 200 with the exam update with the new teacher', () => {
    let tmp = {
      teacher: 3
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(2);
        expect(json.taskgroup).toEqual(json.taskgroup);
        expect(json.startline).toEqual(json.startline);
        expect(json.deadline).toEqual(json.deadline);
        expect(json.classes).toEqual(json.classes);
        expect(json.teacher).toEqual(tmp.teacher);
      })
  });

  test('the PUT with a taskgroup not integer should return 409', () => {
    let tmp = {
      taskgroup: 'pippo baudo'
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(409);
      })
  });

  test('the PUT with a deadline not string should return 409', () => {
    let tmp = {
      deadline: 9
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(409);
      })
  });

/*
  test('the PUT with classes not array should return 409', () => {
    let tmp = {
      classes: 'jorge'
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(409);
      })
  });
*/

  test('the PUT with a teacher not integer should return 409', () => {
    let tmp = {
      teacher: 'fuasto'
    }

    return setPut(tmp, 2)
      .then((response) => {
        expect(response.status).toBe(409);
      })
  });
});

describe('testing DELETE on /exams/:examId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  test('the correct DELETE should return 200', () => {
    let tmp = db.getById('Exam', 1);

    return setDelete(1)
      .then((response) => {
        expect(response.status).toBe(200);
      })
      .then(async () => {
        await setPost(tmp);
      });
  });

  test('the DELETE with a Nan ID should return 400', () => {
    return setDelete('ciao')
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the DELETE with a ID == null should return 400', () => {
    let tmp = null;
    return setDelete(tmp)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the DELETE with a ID < 0 should return 400', () => {
    return setDelete(-2)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the DELETE with a ID == 0 should return 400', () => {
    return setDelete(0)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the DELETE with a not Integer ID should return 400', () => {
    return setDelete(1.54)
      .then((response) => {
        expect(response.status).toBe(400);
      })
  });

  test('the DELETE with a not existing ID should return 404', () => {
    let tmp = db.getNewId('Exam');
    return setDelete(tmp)
      .then((response) => {
        expect(response.status).toBe(404);
      })
  });
});