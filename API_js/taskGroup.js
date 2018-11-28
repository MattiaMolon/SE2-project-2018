const express = require('express');
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
    if(taskGroups_offered.length > 0){
    res.json(taskGroups_offered);
    }
    else{
        res.status(404).send("Error 404 : No Task-Groups found!");
    }
 })

 app.post('/taskGroups', (req, res) => {
    const taskGroup_name = req.body.name;
    const taskGroup_id = taskGroups_offered.length + 1;
    const taskGroup_tasks = req.body.tasks;
    const taskGroup_numberTasks = taskGroup_tasks.length;

    if(taskGroup_name == null || taskGroup_tasks == null || taskGroup_id == null || taskGroup_numberTasks == null){
        res.status(400).send("Error 400 : Something went wrong!");
    }else if(!isNaN(taskGroup_name) || !(taskGroup_tasks instanceof Array)){
        res.status(400).send("Error 400 : Something went wrong!");
    }else{
        const new_taskGroup =  {id: taskGroup_id, name: taskGroup_name, numberTasks: taskGroup_numberTasks, tasks: taskGroup_tasks};
        taskGroups_offered.push(new_taskGroup);
        res.status(201);
        res.json(new_taskGroup);
        console.log(taskGroups_offered);
    }
})

app.put('/taskGroups', (req, res) =>{
    //CHESSIFA
})

app.delete('/taskGroups', (req, res) =>{
    
    if(taskGroups_offered.error){
        res.status(400).send("Error 400 : Something went wrong!");
    }else{
        taskGroups_offered.splice(0, taskGroups_offered.length);

        res.status(204);
        res.json(taskGroups_offered);
        console.log('All the users have been deleted successfully');
    }

})

app.get('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = taskGroups_offered.find(t => t.id === parseInt(req.params.taskGroupID));
    if(taskGroup_searched == null){
        res.status(404).send('404 - We are sorry. No taskGroup found with given id');
    }
    else{
        res.json(taskGroup_searched);
        res.status(200);
    }

})

app.put('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = taskGroups_offered.find(t => t.id === parseInt(req.params.taskGroupID));

    if(taskGroup_searched == null){

        res.status(404).send('404 - We are sorry. No taskGroup found with given id');

    }else{

            const index = taskGroups_offered.indexOf(taskGroup_searched);
            const update_name = req.body.name;
            const update_tasks = req.body.tasks;

            if(update_name!=null && update_name.isNaN()){
                taskGroups_offered[index].name = update_name;
            }

            if(update_tasks!=null && (update_tasks instanceof Array)){
                taskGroups_offered[index].tasks = update_tasks;
                taskGroups_offered[index].numberTasks = update_tasks.length;
            }

            res.status(204);
            res.json(taskGroups_offered[index]);
            console.log('User update successfully');
    }

})

app.delete('/taskGroups/:taskGroupID' , (req, res) =>{

    const taskGroup_searched = taskGroups_offered.find(t => t.id === parseInt(req.params.taskGroupID));
    const index = taskGroups_offered.indexOf(taskGroup_searched);
    if(taskGroup_searched == null){
        res.status(404).send('404 - We are sorry. No taskGroup found with given id');
    }else{
        taskGroups_offered.splice(index, 1);
        res.status(204).send(taskGroup_searched);
    }

})

app.listen(PORT,() => console.log('Listen on port '+PORT));