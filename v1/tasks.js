const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database');
const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true}));



///// UTILI /////
// porta del programma
const PORT = process.env.PORT || 3000;

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
    
    tasks = db.getAll('Task');

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
            newId = db.getNewId('Task');

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

            db.addItem('Task', newTask);
            res.status(201).json(newTask);
            
        }catch{
            error400(res); //console.log(7);
        }
    }
});

// DELETE /task
app.delete('/tasks', (req, res) => {
    db.deleteAll('Task');
    res.status(204);
});

// GET /task/:taskId
app.get('/tasks/:taskId', (req, res) => {

    let taskId = +req.params.taskId;

    if(isIdCorrect(taskId, res)){
        try{

            // prendo task dal database se esiste
            let taskToSend;
            taskToSend = db.getById('Task', taskId);

            // spedisco errore o il task in base alla risposta del database
            if(taskToSend == null){
                let message = {
                    codiceDiStato : 404,
                    message : 'We\'re sorry. No task found with the given ID'
                };
                res.status(404).json(message);
            }
            else{
                res.status(200).json(taskToSend);
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

            if( db.deleteById('Task', taskId) ){
                res.status(204);
            }
            else{
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