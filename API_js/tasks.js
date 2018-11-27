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
        errore: 400,
        message: 'We\'re sorry. No task found'
    }
    res.status(400);
    res.json(message);
};

// Funzione per controllare che un oggetto sia una stringa
function isString (x){
    return (typeof x === "string" || x instanceof String);
}


///// METODI ///// 
// GET /tasks
app.get('/tasks', (req, res) => {
    
    if(tasks.length == 0){
        error400(res);
    }
    else{
        res.status(200);
        res.json(tasks);
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
        error400(res); console.log(6);
    }
    else{
        // setto la newtask e la setto
        try{

            let newtask;
            if(risp.questionType == 'multipleChoice'){
                newtask = {
                    id : tasks.length,
                    question : risp.question,
                    questionType : 'multipleChoice',
                    choices : risp.choices,
                    answers : risp.answers,
                    teacher : risp.teacher
                };
            } else if(risp.questionType == 'openAnswer'){
                newtask = {
                    id : tasks.length,
                    question : risp.question,
                    questionType : 'openAnswer',
                    choices : undefined,
                    answers : undefined,
                    teacher : risp.teacher
                };
            }

            tasks.push(newtask);
            res.status(201);
            res.json(newtask);
            
        }catch{
            error400(res); //console.log(7);
        }
    }
});


// Metto in ascolto la funzione
app.listen(PORT);