const express = require('express');
const db =  require('../database/database');
var bodyParser = require('body-parser');

const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true}));

const PORT = process.env.PORT || 3000;
const SOME_NUM = process.env.PORT || 40;

var taskGroups_offered = [
    {id: 1, name: 'taskgroup1', numberTasks: 2,  tasks: [
        {name: 'task1', description:'task_description'},
        {name: 'task2', description:'task_description'},
        {name: 'task3', description:'task_description'}
    ]} ,
    {id: 2, name:'taskgroup2', numberTasks: 2,  tasks: [
        {name: 'task1', description:'task_description'},
        {name: 'task2', description:'task_description'}
    ]}

];

app.get('/', (req, res) => res.send('HELLO WORD! no fail no on fail'+SOME_NUM))

app.get('/taskGroups', (req, res) => {
    if(db.getAll('taskGroup').length > 0){
        res.status(200);
        res.json(db.getAll('taskGroup'));
    }
    else{
        res.status(404).send("Error 404 : No Task-Groups found!");
    }
 })

 app.post('/taskGroups', (req, res) => {
    const taskGroup_name = req.body.name;
    const taskGroup_id = db.getNewId('taskGroup')
    const taskGroup_tasks = req.body.tasks;
    const taskGroup_numberTasks = taskGroup_tasks.length;

    if(taskGroup_name == null){
        res.status(400).send("Error 400 : You must insert a valid taskGroup name!");
    } else if(taskGroup_tasks == null){
        res.status(400).send("You must insert a taskGroup task list valid!");
    } else if(taskGroup_id == null){
        res.status(400).send("Error 400 : Something went wrong! (id null)");
    } else if(taskGroup_numberTasks == null){
        res.status(400).send("Error 400 : Something went wrong! (numberTasks null)");
    }else if(!isNaN(taskGroup_name)){
        res.status(400).send("Error 400 : You must insert a valid taskGroup name!");
    }else if(taskGroup_tasks instanceof Array){
        res.status(400).send("Error 400 : Something went wrong!");
    }else{

        const controllo1 = true
        const controllo2 = true

        taskGroup_tasks.forEach(element => {
            if(isNaN(element)){
                controllo1 = false;
            }

            const controllo_task = db.getByIdyId('taskGroup', element)
            if(controllo_task == null){
                controllo2 = false;
            }
        });

        if(controllo1 && controllo2){
            const new_taskGroup =  {id: taskGroup_id, name: taskGroup_name, numberTasks: taskGroup_numberTasks, tasks: taskGroup_tasks};
            db.addItem('taskGroup', new_taskGroup);
            res.status(201);
            res.json(new_taskGroup);
            console.log(db.deleteAll('taskGroup'));
        }else{
            if(!controllo1){
                res.status(400).send("Error 400 : Something went wrong! (tasks array contains NaN object");
            }else{
                res.status(400).send("Error 400 : Something went wrong! (tasks array contains invalid taskGroupID");
            }
        }

    }
})

app.delete('/taskGroups', (req, res) =>{
    
    if(db.deleteAll('taskGroup')){
        res.status(204);
        console.log('All the users have been deleted successfully');
    }else{
        res.status(400).send("Error 400 : Something went wrong!");
    }

})

app.get('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = db.getById('taskGroup', taskGroupID);
    if(taskGroup_searched == null){
        res.status(404).send('404 - We are sorry. No taskGroup found with given id');
    }
    else{
        res.json(taskGroup_searched);
        res.status(200);
    }

})

app.put('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = db.getById('taskGroup', taskGroupID);

    if(taskGroup_searched == null){
        res.status(404).send('404 - We are sorry. No taskGroup found with given id');
    } 
    else {

        const update_name = req.body.name;
        const update_tasks = req.body.tasks;

        if(update_name!=null && !isNaN(update_name)){
            res.status(400).send("Error 400 : You have to insert a valid taskGroup name!");
        } else if(update_tasks!=null && update_tasks instanceof Array){
            res.status(400).send("Error 400 : Something went wrong! (task aray null or not an array)");
        } else{

            const controllo1 = true
            const controllo2 = true

            update_tasks.forEach(element => {
                if(isNaN(element)){
                    controllo1 = false;
                }

                const controllo_task = db.getByIdyId('taskGroup', element)
                if(controllo_task == null){
                    controllo2 = false;
                }
            });

            if(controllo1 && controllo2){

                if(update_name!=null){
                    taskGroup_searched.name = update_name;
                }

                if(update_tasks!=null){
                    taskGroup_searched.tasks = update_tasks;
                }

                if(db.updateItem('taskGroup', taskGroup_searched)){
                    res.status(204);
                    res.json(taskGroup_searched);
                    console.log('User has been updated successfully');
                }else{
                    res.status(400).send("Error 400 : Update error!");
                }

            }else{
                if(!controllo1){
                    res.status(400).send("Error 400 : Something went wrong! (tasks array contains NaN object");
                }else{
                    res.status(400).send("Error 400 : Something went wrong! (tasks array contains invalid taskGroupID");
                }
            }
        }

    }

})

app.delete('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = db.getById('taskGroup', taskGroupID);
    if(taskGroup_searched == null){
        res.status(404).send('404 - We are sorry. No taskGroup found with given id');
    }else{
        db.deleteById('taskGroup', taskGroupID);
        res.status(204).json(db.getAll('taskGroup'));
    }

})

app.listen(PORT,() => console.log('Listen on port '+PORT));