const fetch = require ('node-fetch');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://se2-project-2018.herokuapp.com' + '/reviews';
const table = 'Review';

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

describe('testing GET /reviews', () => {

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

    })

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

      //RIGHT ONE

      test('the POST with all right should return status 201 with the new task created', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(201);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toBeGreaterThan(0);
                expect(json.submission).toEqual(body.submission);
                expect(json.uniNumber).toEqual(body.uniNumber);
                expect(json.feedback).toEqual(body.feedback);
                expect(json.mark).toEqual(body.mark);
            })

    })

    //NO FIELD GIVEN

    test('the POST with no submission ID should return status 400', () => {

        let body = {
            //submission: 3,
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with no uniNumber should return status 400', () => {

        let body = {
            submission: 3,
            //uniNumber: 182930,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with no feedback should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            //feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with no mark should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: 'Good exam',
            //mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    //ILLOGICAL OPTIONS

    test('the POST with a string as submission should return status 400', () => {

        let body = {
            submission: 'submission',
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    // test('the POST with submission ID which not exist should return status 400', () => {

    //     let body = {
    //         submission: 7,
    //         uniNumber: 182930,
    //         feedback: 'Good exam',
    //         mark: 22
    //     }

    //     return setPost(body)
    //         .then((response) => {
    //             expect(response.status).toBe(400);
    //         })

    // })

    test('the POST with a negative number as submission ID should return status 400', () => {

        let body = {
            submission: -1,
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a string as uniNumber should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 'uniNumber',
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a negative number as uniNumber should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: -8,
            feedback: 'Good exam',
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a negative number as feedback should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: -1,
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a number as feedback should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: 5,
            mark: 22
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a string as mark should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: 'twentytwo'
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the POST with a negative number as mark should return status 400', () => {

        let body = {
            submission: 3,
            uniNumber: 182930,
            feedback: 'Good exam',
            mark: -67
        }

        return setPost(body)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

})

describe('testing DELETE /reviews', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
    });

    test('the DELETE should return status 200', () => {

        let tmp = db.getAll(table);

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

        let tmp = db.getAll(table); 
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

describe('testing GET /reviews/:reviewID', () => {

    afterEach(async ()=>{
        let tmp = db.getAll(table);
        await setDelete();
        for(let i = 0; i<tmp.length; i++){
          await setPost(tmp[i]);
        }
      });

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

    test('the GET with a string as reviewID should return status 400', () => {

        return setGet('ciao')
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the GET with an inhexisting reviewID should return status 404', () => {

        return setGet(23)
            .then((response) => {
                expect(response.status).toBe(404);
            })

    })

    test('the GET with a negative number as reviewID should return status 400', () => {

        return setGet('ciao')
            .then((response) => {
                expect(response.status).toBe(400);
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

    test('the PUT with updated submission should return 200', () => {

        let tmp = db.getById(table, 3)

        let body = {
            submission: 1,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(3);
                expect(json.submission).toEqual(body.submission);
                expect(json.uniNumber).toEqual(tmp.uniNumber);
                expect(json.feedback).toEqual(tmp.feedback);
                expect(json.mark).toEqual(tmp.mark);
            })

    })

    test('the PUT with updated uniNumber should return 200', () => {

        let tmp = db.getById(table, 3)

        let body = {
            uniNumber: 1,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(3);
                expect(json.submission).toEqual(tmp.submission);
                expect(json.uniNumber).toEqual(body.uniNumber);
                expect(json.feedback).toEqual(tmp.feedback);
                expect(json.mark).toEqual(tmp.mark);
            })

    })

    test('the PUT with updated feedback should return 200', () => {

        let tmp = db.getById(table, 3)

        let body = {
            feedback: 'Great work!',
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(3);
                expect(json.submission).toEqual(tmp.submission);
                expect(json.uniNumber).toEqual(tmp.uniNumber);
                expect(json.feedback).toEqual(body.feedback);
                expect(json.mark).toEqual(tmp.mark);
            })

    })

    test('the PUT with updated mark should return 200', () => {

        let tmp = db.getById(table, 3)

        let body = {
            mark: 30,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(200);
                return response.json();
            })
            .then((json) => {
                expect(json.id).toEqual(3);
                expect(json.submission).toEqual(tmp.submission);
                expect(json.uniNumber).toEqual(tmp.uniNumber);
                expect(json.feedback).toEqual(tmp.feedback);
                expect(json.mark).toEqual(body.mark);
            })

    })

    //ILLEGAL OPTIONS

    test('the PUT with inhexisting review ID should return 404', () => {

        let body = {
            mark: 30,
        }

        return setPut(body, 89)
            .then((response) => {
                expect(response.status).toBe(404);
            })

    })

    test('the PUT with a string as review ID should return 400', () => {

        let body = {
            mark: 30,
        }

        return setPut(body, 'ciao')
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a negative number as review ID should return 400', () => {

        let body = {
            mark: 30,
        }

        return setPut(body, -5)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a string as submission should return 400', () => {

        let body = {
            submission: 'submission',
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a negative number as submission should return 400', () => {

        let body = {
            submission: -4,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a string as uniNumber should return 400', () => {

        let body = {
            uniNumber: 'uniNumber',
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a negative number as uniNumber should return 400', () => {

        let body = {
            uniNumber: -2,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a number as feedback should return 400', () => {

        let body = {
            feedback: 5,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a string as mark should return 400', () => {

        let body = {
            mark: 'mark',
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
            })

    })

    test('the PUT with a negative numeber as mark should return 400', () => {

        let body = {
            mark: -4,
        }

        return setPut(body, 3)
            .then((response) => {
                expect(response.status).toBe(400);
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

    test('the DELETE should return 200 status', () => {

        return setDelete(1)
            .then((response) => {
                expect(response.status).toBe(200);
            })

    })

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

    test('the DELETE with an ID that doesn\'t exist should return status 404', () => {

        return setDelete(10)
            .then((response) => {
                expect(response.status).toBe(404);
            })

    })

})
