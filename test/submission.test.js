
const PORT = process.env.SERVER_URL || 3000;
const url = "http://localhost:"+PORT+"/submissions";
const fetch = require('node-fetch');
const table = 'Submission';
const db = require('../database/database');

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

const submissionSample = {
  class: 2, 
  teacher: 1, 
  student: 2,
  exam: 3, 
  data: "09/12/2018 13:00",
  answer: ['Fabio', 'B', 'git stash', '2.3']
};

let submissionUpdateSample = {
  class: 2, 
  teacher: 1, 
  student: 2,
  exam: 3, 
  data: "09/12/2018 13:00",
  answer: ['Fabio', 'B', 'git commit', '1.3']
}

// Testing

// collection
describe('Testing GET methods on /submissions', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The GET /submission should return 200 & an array with json elements that represent the submissions', () => {

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
  test('The GET /submissions should return error 404 with an empty database', async () => {
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
  // come posso testare questa cosa??

});

describe('Testing POST methods on /submission', () => {

  afterEach(async ()=>{

    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 201
  test('The POST with a correct Submission should return 201 & the submission sent', () => {

    return setPost(submissionSample)
      .then((res) => {
        expect(res.status).toBe(201);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.class).toEqual(submissionSample.class);
        expect(json.teacher).toEqual(submissionSample.teacher);
        expect(json.student).toEqual(submissionSample.student);
        expect(json.exam).toEqual(submissionSample.exam);
        expect(json.data).toEqual(submissionSample.data);
        expect(json.answer).toEqual(submissionSample.answer)
      });
  });
  
  test('The POST with an array of one element that is a string as a submission answer should return 201', () => {
    let tmp = submissionSample;
    tmp.answer = ['ciao'];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(201);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.class).toEqual(submissionSample.class);
        expect(json.teacher).toEqual(submissionSample.teacher);
        expect(json.student).toEqual(submissionSample.student);
        expect(json.exam).toEqual(submissionSample.exam);
        expect(json.data).toEqual(submissionSample.data);
        expect(json.answer).toEqual(tmp.answer)
      });
  });

  test('The POST with an array of one element that is a number as a submission answer should return 201', () => {
    let tmp = submissionSample;
    tmp.answer = [2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(201);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toBeGreaterThan(0);
        expect(json.class).toEqual(submissionSample.class);
        expect(json.teacher).toEqual(submissionSample.teacher);
        expect(json.student).toEqual(submissionSample.student);
        expect(json.exam).toEqual(submissionSample.exam);
        expect(json.data).toEqual(submissionSample.data);
        expect(json.answer).toEqual(tmp.answer)
      });
  });

  // STATUS 400
  test('The POST with a missing class in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.class = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing teacher in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.teacher = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing student in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.student = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing exam in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.exam = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing date in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.data = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a missing answer in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.answer = undefined;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null class in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.class = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null teacher in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.teacher = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null student in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.student = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null exam in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.exam = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null date in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.data = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a null answer in the Submission should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.answer = null;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a submission class should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.class = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a submission teacher should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.teacher = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a submission student should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.student = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a submission exam should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.exam = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a number as a submission date should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.data = 2;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a string as a submission answer should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.answer = 'ciao';

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a submission class should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.class = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a submission teacher should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.teacher = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a submission student should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.student = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a submission exam should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.exam = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with an array as a submission date should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.data = [1,2];

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission class should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.class = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission teacher should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.teacher = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission student should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.student = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission exam should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.exam = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission date should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.data = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

  test('The POST with a boolean as a submission answer should return bad request 400', () => {
    let tmp = submissionSample;
    tmp.answer = true;

    return setPost(tmp)
      .then((res) => {
        expect(res.status).toBe(400);
      })
  });

});

describe('Testing DELETE methods on /submission', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The DELETE /submission should return 200 if the delete was successful', async () => {
    
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
  test('The DELETE /submission should return error 400 if there are no submissions in the database', async () => {
    let tmp = db.getAll(table);
    await setDelete();

    return setDelete() 
      .then((res) => {
        expect(res.status).toBe(400);
      })
      .then(async () => {
        for (let i=0; i<tmp.length; i++) {
          await setPost(tmp[i]);
        }
      });
  });

});

describe('Testing GET methods on /submission/:submissionId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The GET /submission/:submissionId should return 200 & the submission with the same ID', () => {

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
  test('The GET /submission/:submissionId should return 404 if there is no Id in the database matching submissionId', () => {

    let tmpId = db.getNewId(table);
    
    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  // STATUS 400
  test('The GET /submission/:submissionId should return 400 if the submissionId is not a number', () => {

    let tmpId = 'ciao';

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /submission/:submissionId should return 400 if the submissionId is null', () => {
    let tmpId = null;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /submission/:submissionId should return 400 if the submissionId is a negative number', () => {
    let tmpId = -1;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /submission/:submissionId should return 400 if the submissionId is not integer', () => {
    let tmpId = 1.2;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The GET /submission/:submissionId should return 400 if the submissionId is equale to 0', () => {
    let tmpId = 0;

    return setGet(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

});

describe('Testing PUT methods on /submission/:submissionId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The PUT /submission/:submissionId with only the field class should return 200 & the submission with the class updated', () => {
    let tmp = {
      class: 2
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(tmp.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field class=null should return 200 & the submission with the old class', () => {
    let tmp = {
      class: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with only the field teacher should return 200 & the submission with the teacher updated', () => {
    let tmp = {
      teacher: 1
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(tmp.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field teacher=null should return 200 & the submission with the old teacher', () => {
    let tmp = {
      teacher: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });
  
  test('The PUT /submission/:submissionId with only the field student should return 200 & the submission with the student updated', () => {
    let tmp = {
      student: 2
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(tmp.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field student=null should return 200 & the submission with the old student', () => {
    let tmp = {
      student: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with only the field exam should return 200 & the submission with the exam updated', () => {
    let tmp = {
      exam: 2
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(tmp.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field exam=null should return 200 & the submission with the old exam', () => {
    let tmp = {
      exam: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with only the field date should return 200 & the submission with the date updated', () => {
    let tmp = {
      data: "15/12/2019 17:30"
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(tmp.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field date=null should return 200 & the submission with the old date', () => {
    let tmp = {
      date: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  test('The PUT /submission/:submissionId with only the field answer should return 200 & the submission with the answer updated', () => {
    let tmp = {
      answer: ["Giovanni", 'D', 'git rebase', '15']
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(tmp.answer)
      });
  });

  test('The PUT /submission/:submissionId with the field answer=null should return 200 & the submission with the old answer', () => {
    let tmp = {
      answer: null
    };

    let submissionToPut = db.getById(table, 1);

    return setPut(tmp, 1)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.class).toEqual(submissionToPut.class);
        expect(json.teacher).toEqual(submissionToPut.teacher);
        expect(json.student).toEqual(submissionToPut.student);
        expect(json.exam).toEqual(submissionToPut.exam);
        expect(json.data).toEqual(submissionToPut.data);
        expect(json.answer).toEqual(submissionToPut.answer)
      });
  });

  // STATUS 404
  test('The PUT /submission/:submissionId should return error 404 if there is no ID in the database matching submissionId', () => {
    let tmpId = 60;

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  // STATUS 400
  test('The PUT /submission/:submissionId should return 400 if the submissionId is not a number', () => {

    let tmpId = 'ciao';

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /submission/:submissionId should return 400 if the submissionId is null', () => {
    let tmpId = null;

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /submission/:submissionId should return 400 if the submissionId is a negative number', () => {
    let tmpId = -1;

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /submission/:submissionId should return 400 if the submissionId is not integer', () => {
    let tmpId = 1.2;

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The PUT /submission/:submissionId should return 400 if the submissionId is equale to 0', () => {
    let tmpId = 0;

    return setPut(submissionUpdateSample, tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  // andrebbe anche testato il fatto che l'utente passi valori validi per ogni singolo campo

});

describe('Testing DELETE methods on /submission/:submissionId', () => {

  afterEach(async ()=>{
    let tmp = db.getAll(table);
    await setDelete();
    for(let i = 0; i<tmp.length; i++){
      await setPost(tmp[i]);
    }
  });

  // STATUS 200
  test('The DELETE /submission/:submissionId should return 200 if the delete of the submission with the matching ID was successful', () => {
    
    let tmp = db.getById(table, 1);

    return setDelete(1)
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .then(async () => {
        await setPost(tmp);
      });
  });

  // STATUS 404
  test('The DELETE /submission/:submissionId should return error 404 if there are no submission in the database matching the ID', () => {

    return setDelete(55) 
      .then((res) => {
        expect(res.status).toBe(404);
      })
  });

  // STATUS 400
  test('The DELETE /submission/:submissionId should return 400 if the submissionId is negative', () => {
    let tmpId = -1;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The DELETE /submission/:submissionId should return 400 if the submissionId is not integer', () => {
    let tmpId = 2.3;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The DELETE /submission/:submissionId should return 400 if the submissionId is 0', () => {
    let tmpId = 0;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test('The DELETE /submission/:submissionId should return 400 if the submissionId is null', () => {
    let tmpId = null;

    return setDelete(tmpId)
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});
