const fetch = require ('node-fetch');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/tasks';
const table = 'Task';

function setGet(id="") {
return fetch(SERVER_URL+"/"+id,{
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

function setDelete(id=""){
return fetch(SERVER_URL+"/"+id, {
    method: 'DELETE',
    headers:{
        'Accept': 'application/json'
    }
});
}

describe('testing GET /tasks', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });

//RIGHT ONE

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

    })

    //WRONG ONE

    test('the GET with empty database table should return 404', async () => {

        let tmp = db.getAll('Task'); 
        await setDelete();

        return setGet()
            .then((response) => {
                expect(response.status).toBe(404);
                return response.json();
            })
            .then(async () => {
                for(let i = 0; i < tmp.length ; i++){
                    await setPost(tmp[i]);
                }
            })

    })

 })

describe('testing POST /tasks ', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });

    //RIGHT ONES

    test('the POST with multipleChoice as questionType and defined choices should return status 201 with the new task created', () => {

        let body = {
            question: 'domanda4',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(201);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toBeGreaterThan(0);
                expect(json.question).toEqual(body.question);
                expect(json.questionType).toEqual(body.questionType);
                expect(json.choices).toEqual(body.choices);
                expect(json.answers).toEqual(body.answers);
                expect(json.teacher).toEqual(body.teacher);
            })

    })

    test('the POST with multipleChoice as openAnswer and undefined choices and answers should return status 201 with the new task created', () => {

        let body = {
            question: 'domanda1',
            questionType: 'openAnswer',
            //choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            //answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(201);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toBeGreaterThan(0);
                expect(json.question).toEqual(body.question);
                expect(json.questionType).toEqual(body.questionType);
                expect(json.answers).toEqual(body.answers);
                expect(json.teacher).toEqual(body.teacher);
            })

    })

    //UNDEFINED FIELDS - EXTRA DEFINED FIELDS

    test('the POST with undefined question should return status 400', () => {

        let body = {
            //question: 'domanda1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with undefined questionType should return status 400', () => {

        let body = {
            question: 'domanda1',
            //questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with multipleChoices as questionType and undefined choices should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'multipleChoice',
            //choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with openAnswer as questionType and defined choices should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'openAnswer',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with multipleChoice as openAnswer and undefined choices and defined answers should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'openAnswer',
            //choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            });
    })

    test('the POST with multipleChoices as questionType, defined choices AND undefined answers should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            //answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with undefined teacher should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            //teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an undefined choice should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'multipleChoice',
            choices: [undefined , 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an undefined answer should return status 400', () => {

        let body = {
            question: 'domanda1',
            questionType: 'multipleChoice',
            choices: ['ris1' , 'ris2', 'ris3', 'ris4'],
            answers: [undefined, 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    //ILLOGICAL OPTIONS

    test('the POST with a number as question should return status 400', () => {

        let body = {
            question: 1,
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as question should return status 400', () => {

        let body = {
            question: {
                name : 'question1'
            },
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an array as question should return status 400', () => {

        let body = {
            question: [1, 'question1'],
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as questionType should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 1,
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as questionType should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: {
                name : 'multipleChoice'
            },
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an array as questionType should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: [1, 'openAnswer'],
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as choices should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: 2,
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a string as choices should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: 'choices',
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as choices should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: { name : 'ris1' },
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as choice should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: ['ris1', 1, 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as choice should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', { name : 'ris2' }, 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an array as choice should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', ['ris2'], 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as answers should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: 2,
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a string as answers should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: 'answers',
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as answers should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: { name : 'ris1' },
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as one of the answers should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', { name : 'ris2' }],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as answer should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoices',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 1],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an array as answer should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', ['ris2']],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an answer different from all choices should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris5'],
            teacher: 1
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a string as teacher should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', ['ris2']],
            teacher: 'teacher1'
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a vector as teacher should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', ['ris2']],
            teacher: [1,2]
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with an object as teacher should return status 400', () => {

        let body = {
            question: 'question1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', ['ris2']],
            teacher: { name: 'teacher1' }
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

})

describe('testing DELETE /tasks ', () => { 

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });

    test('the DELETE should return STATUS 200', () => {

        let tmp = db.getAll('Task');

        return setDelete()
            .then((response) => {
                expect(response.status).toBe(200);
            })
            .then( async () => {
                for(let i = 0; i < tmp.length ; i++){
                    await setPost(tmp[i]);
                }
            })

    })

    test('the DELETE with empty database table should return 400', async () => {

        let tmp = db.getAll('Task'); 
        await setDelete();

        return setDelete()
            .then((response) => {
                expect(response.status).toBe(400);
            })
            .then(async () => {
                for(let i = 0; i < tmp.length ; i++){
                    await setPost(tmp[i]);
                }
            })

    })

})

describe('testing GET /tasks/:taskID', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });
    
    //RIGHT ONE

    test('the GET should return the request task', () => {

        return setGet(1)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(1);
            })

    })

    //UNDEFINED FIELDS

    test('the GET with undefined ID should return status 400', () => {

        return setGet(undefined)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    //ILLOGICAL OPTION

    test('the GET with ID as a string should return status 400', () => {

        return setGet('ciao')
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the GET with ID as a vector should return status 400', () => {

        return setGet([1, 2])
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the GET with ID as an object should return status 400', () => {

        return setGet({name : '1'})
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the GET with an ID that doesn\'t exist should return status 404', () => {

        return setGet(10)
            .then((response) => {
                expect(response.status).toBe(404);
            })

    })


})

describe('testing PUT /tasks/:tasksID', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });

    test('the PUT with updated question should return 200', () => {

        let tmp = db.getById('Task', 3)

        let body = {
            question: 'update question',
            questionType: undefined,
            choices: undefined,
            answers: undefined,
            teacher: undefined
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(3);
                expect(json.question).toEqual(body.question);
                expect(json.questionType).toEqual(tmp.questionType);
                expect(json.choices).toEqual(tmp.choices);
                expect(json.answers).toEqual(tmp.answers);
                expect(json.teacher).toEqual(tmp.teacher);
            })

    })

})

describe('testing DELETE /tasks/:taskID', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });
    
    //RIGHT ONE

    test('the DELETE should return 200 status', () => {

        return setDelete(4)
            .then((response) => {
                expect(response.status).toBe(200);
            })

    })

    //UNDEFINED FIELDS

    test('the DELETE with undefined ID should return status 400', () => {

        return setDelete(undefined)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    //ILLOGICAL OPTION

    test('the DELETE with ID as a string should return status 400', () => {

        return setDelete('ciao')
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the DELETE with ID as a vector should return status 400', () => {

        return setDelete([1, 2])
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the DELETE with ID as an object should return status 400', () => {

        return setDelete({name : '1'})
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the DELETE with an ID that doesn\'t exist should return status 404', () => {

        return setDelete(10)
            .then((response) => {
                expect(response.status).toBe(404);
            })

    })

})



