const fetch = require ('node-fetch');
const db = require('../database/database')
const PORT = process.env.SERVER_URL || 3000;
const SERVER_URL = 'http://localhost:' + PORT + '/taskGroups';


// UTILS
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

const taskGroupSample = {
  name: 'taskgroup1',
  numberTasks: 1,
  tasks: [2]
}

let taskGroupUpdateSample = {
  name: 'updated',
  numberTasks: 2,
  tasks: [1,3]
}


// TESTS
describe('testing GET on /taskGroups', () => {
	test('the GET should return an array with json elements', ()=>{

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
  
  test('the GET with an empty database should return 404', () =>{
    let tmp = db.getAll('TaskGroup');
    db.deleteAll('TaskGroup');

    return setGet()
      .then((response) =>{
        expect(response.status).toBe(404);
      })
      .then(() =>{
        for(let i = 0; i<tmp.length; i++){
          db.addItem('TaskGroup', tmp[i]);
        }
      });
  })
  
});


describe('testing POST on /taskGroups', () =>{

    test('the POST with a correct taskGroup should return 201 with the same taskGroup sent',() =>{
      return setPost(taskGroupSample)
        .then((response) => {
          expect(response.status).toBe(201);
          return response.json();
        })
        .then((json) => {
          expect(json.id).toBeGreaterThan(0);
          expect(json.name).toEqual(taskGroupSample.name);
          expect(json.numberTasks).toEqual(taskGroupSample.numberTasks);
          expect(json.tasks).toEqual(taskGroupSample.tasks);
        });
    });

    test('the POST without name field should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.name = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });
    
    test('the POST without numberaTask field should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.numberTasks = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });

    test('the POST without tasks field should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.tasks = undefined;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });

    test('the POST with the numerTasks different from the effective number of tasks should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.numberTasks = 3;

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });

    test('the POST with a task that doesn\'t exist should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.tasks = [2,4];

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });
  
    test('the POST with a task that isn\'t a number should return 400', () =>{
      let tmp = taskGroupSample;
      tmp.tasks = [2,"errore"];

      return setPost(tmp)
        .then((response) => {
          expect(response.status).toBe(400);
        })
    });
});


//FUNZIONE CON 204 VA MA NON RESTITUISCE NULLA, COME LA TESTO?
describe('testing DELETE on /taskGroups', () =>{

  test('the DELETE should return 200', () => {

    let tmp = db.getAll('TaskGroup');

    return setDelete()
      .then((response)=>{
        expect(response.status).toBe(200);
      })
      .then(() => {
        for(let i =0; i<tmp.length; i++){
          db.addItem('TaskGroup', tmp[i]);
        }
      });
  });

});


describe('testing GET on /taskGroups/:taskGroupID', () =>{

  test('the GET with a valid taskGroupId should return the taskGroup with the same ID', () =>{

    return setGet(1)
      .then((response) =>{
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) =>{
        expect(json).toBeDefined();
        expect(json.id).toEqual(1);
      })
  });

  test('the GET with an empty database should return 404', () =>{

    let tmp = db.getAll('TaskGroup');
    db.deleteAll('TaskGroup');

    return setGet(1)
      .then((response) =>{
        expect(response.status).toBe(404);
      })
      .then(() =>{
        for(let i = 0; i<tmp.length; i++){
          db.addItem('TaskGroup', tmp[i]);
        }
      });
  });

  test('the GET with a negative ID should return 404', () =>{

    return setGet(-1)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the GET with a string ID should return 404', () =>{

    return setGet("error")
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the GET with a non existing ID should return 404', () =>{

    return setGet(99)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

});


describe('testing PUT on /taskGroups/:taskGroupID', () =>{

  test('the PUT with a negative ID should return 404', () =>{

    return setPut(taskGroupUpdateSample,-1)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the PUT with a string ID should return 404', () =>{

    return setPut(taskGroupUpdateSample,"error")
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the PUT with a non existing ID should return 404', () =>{

    return setPut(taskGroupUpdateSample,99)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the PUT with all the fields correct should return 200 with the same taskGroup sent',() =>{
    return setPut(taskGroupUpdateSample, 1)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(taskGroupUpdateSample.name);
        expect(json.numberTasks).toEqual(taskGroupUpdateSample.numberTasks);
        expect(json.tasks).toEqual(taskGroupUpdateSample.tasks);
      });
  });

  test('the PUT with only the name field should return 200 with the taskGroup item updated with the new name',() =>{
    let tmp = {
      name: "update2"
    };
    
    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(tmp.name);
        expect(json.numberTasks).toEqual(taskGroupUpdateSample.numberTasks);
        expect(json.tasks).toEqual(taskGroupUpdateSample.tasks);
      })
      .then(() =>{
        taskGroupUpdateSample.name = tmp.name;
      });
  });

  test('the PUT with only the numberTasks field (equal to the old one) should return 200 with the taskGroup item updated with the new name',() =>{
    let tmp = {
      numerTasks: taskGroupUpdateSample.numberTasks
    };
    
    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(taskGroupUpdateSample.name);
        expect(json.numberTasks).toEqual(taskGroupUpdateSample.numberTasks);
        expect(json.tasks).toEqual(taskGroupUpdateSample.tasks);
      });
  });

  test('the PUT with only the tasks field (with the same amount of element of the old one), should return 200 with the taskGroup item updated with the new name',() =>{
    let tmp ={
      tasks: [2,1]
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(200);
        return response.json();
      })
      .then((json) => {
        expect(json.id).toEqual(1);
        expect(json.name).toEqual(taskGroupUpdateSample.name);
        expect(json.numberTasks).toEqual(taskGroupUpdateSample.numberTasks);
        expect(json.tasks).toEqual(tmp.tasks);
      })
      .then(() =>{
        taskGroupUpdateSample.tasks = tmp.tasks;
      });
  });

  test('the PUT with the numberTasks field wrong should return 409',() =>{
    let tmp ={
      numberTasks: 3
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the tasks field whit different length from numberTasks should return 409', ()=>{
    let tmp ={
      tasks: [1,2,3]
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the tasks field with tasks that don\'t exist should return 409', ()=>{
    let tmp ={
      tasks: [1,4]
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the tasks field with tasks written as strings should return 409', ()=>{
    let tmp ={
      tasks: [1,"4"]
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the tasks field with tasks equal to null should return 409', ()=>{
    let tmp ={
      tasks: [1,null]
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the tasks field not an array should return 409', ()=>{
    let tmp ={
      tasks: "not an array"
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });

  test('the PUT with the name not a string should return 409', ()=> {
    let tmp ={
      name: 1
    };

    return setPut(tmp, 1)
      .then((response) => {
        expect(response.status).toBe(409);
      });
  });
});


//FUNZIONE VA MA NON RESTITUISCE NULLA, COME LA TESTO?
describe('testing DELETE on /taskGroups/:taskGroupID', () =>{

  test('the DELETE should return 200', () => {

    let tmp = db.getById('TaskGroup',1);

    return setDelete(1)
      .then((response)=>{
        expect(response.status).toBe(200);
      })
      .then(() => {
        db.addItem('TaskGroup', tmp);
      });
  });

  test('the DELETE with a negative ID should return 404', () =>{

    return setDelete(-1)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the DELETE with a string ID should return 404', () =>{

    return setDelete("error")
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });

  test('the DELETE with a non existing ID should return 404', () =>{

    return setDelete(99)
      .then((response) =>{
        expect(response.status).toBe(404);
      });
  });
 

});
