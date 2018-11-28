const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true}));



///// UTILI /////
// porta del programma
const PORT = process.env.PORT || 3000;

// database DEMO
let tasks = [
    {
        id : 1,
        question: 'domanda1',
        questionType: 'multipleChoice',
        choices: ['ris1', 'ris2', 'ris3', 'ris4'],
        answers: ['ris1', 'ris2'],
        teacher: 'teacher1'
    },
    {
        id : 2,
        question: 'domanda2',
        questionType: 'multipleChoice',
        choices: ['ris1', 'ris2', 'ris3'],
        answers: ['ris3'],
        teacher: 'teacher2'
    },
    {
        id : 3,
        question: 'domanda3',
        questionType: 'openAnswer',
        choices: undefined,
        answers: undefined,
        teacher: 'teacher3'
    },
];

// Funzione di errore 400
function error400 (res) {
    let message = {
        codiceDiStato: 400,
        message: 'We\'re sorry. No task found'
    }
    res.status(400).json(message);
}

// Funzione per controllare che un oggetto sia una stringa
function isString (x){
    return (typeof x === "string" || x instanceof String);
}

// Funzione per controlllare che un id sia scritto giusto
function isIdCorrect(taskId, res){
    let corretto = true;

    if( isNaN(taskId) ){
        error400(res); 
        corretto = false; //console.log(1); 
    }
    else if( taskId == null){
        error400(res);
        corretto = false; //console.log(2);
    }
    else if( taskId < 0  ){
        error400(res);
        corretto = false; //console.log(3);
    }
    else if ( taskId % 1 != 0 ){
        error400(res);
        corretto = false; //console.log(4);
    }

    return corretto;
}



///// METODI ///// 
// GET /tasks
app.get('/tasks', (req, res) => {
    
    if(tasks.length == 0){
        error400(res);
    }
    else{
        res.status(200).json(tasks);
    }

});

// POST /task
app.post('/tasks', (req, res) => {

    let risp = req.body;

    // errori
    if(risp.question == null || risp.questionType == null || risp.teacher == null){
        error400(res); //console.log(1);
    }
    else if(risp.questionType != 'multipleChoice' && risp.questionType != 'openAnswer'){
        error400(res); //console.log(2);
    }
    else if(risp.questionType == 'multipleChoice' && (risp.choices == null || risp.answers == null)){
        error400(res); //console.log(3);
    }
    else if(risp.questionType == 'openAnswer' && (risp.choices != null || risp.answers != null)){
        error400(res); //console.log(4);
    }
    else if(risp.questionType == 'multipleChoice' && !Array.isArray(risp.choices)){
        error400(res); //console.log(5);
    }
    else if(!isString(risp.question) || !isString(risp.questionType) || !isString(risp.teacher)){
        error400(res); //console.log(6);
    }
    else{
        // setto la newtask e la setto
        try{

            let newTask, newId;
            if(tasks.length == 0){
                newId = 1;
            }else {
                newId = tasks[tasks.length - 1].id + 1;
            }

            if(risp.questionType == 'multipleChoice'){
                newTask = {
                    id : newId,
                    question : risp.question,
                    questionType : 'multipleChoice',
                    choices : risp.choices,
                    answers : risp.answers,
                    teacher : risp.teacher
                };
            } else if(risp.questionType == 'openAnswer'){
                newTask = {
                    id : newId,
                    question : risp.question,
                    questionType : 'openAnswer',
                    choices : undefined,
                    answers : undefined,
                    teacher : risp.teacher
                };
            }

            tasks.push(newTask);
            res.status(201).json(newTask);
            
        }catch{
            error400(res); //console.log(7);
        }
    }
});

// DELETE /task
app.delete('/tasks', (req, res) => {
    tasks = [];
    res.status(204);
});

// GET /task/:taskId
app.get('/tasks/:taskId', (req, res) =>{

    let taskId = +req.params.taskId;

    if(isIdCorrect(taskId, res)){
        try{

            let taskToSend, trovato = false;

            // cerco l'id che mi interessa
            for( let i = 0; i<tasks.length && !trovato; i++){
                if (tasks[i].id == taskId){
                    trovato = true;
                    taskToSend = tasks[i];
                    res.status(200).json(taskToSend);
                }
            }

            // non ho trovato l'id che cercavo
            if (!trovato){
                let message = {
                    codiceDiStato : 404,
                    message : 'We\'re sorry. No task found with the given ID'
                };
                res.status(404).json(message);
            }

        }catch{
            error400(res); //console.log(5);
        }
    }

});

// DELETE /task/:taskId
app.delete('/tasks/:taskId', (req, res) => {
    
    let taskId = +req.params.taskId;

    if( isIdCorrect(taskId, res)){
        try{

            let trovato = false;

            // cerco l'id che mi interessa
            for( let i = 0; i<tasks.length && !trovato; i++){
                if (tasks[i].id == taskId){
                    trovato = true;
                    tasks.splice(i, 1);
                    res.status(204);
                }
            }

            // non ho trovato l'id che cercavo
            if (!trovato){
                let message = {
                    codiceDiStato : 404,
                    message : 'We\'re sorry. No task found with the given ID'
                };
                res.status(404).json(message);
            }

        }catch{
            error400(res); console.log(5);
        }
    }

});



// Metto in ascolto l'applicazione
app.listen(PORT);