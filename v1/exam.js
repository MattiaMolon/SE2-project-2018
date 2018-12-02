const express = require('express');
var bodyParser = require('body-parser');

const db = require('../database/database');

const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

//root
app.get('/', (req, res) => res.send('Hi! This is the root page. Here you can find only Exams'))

// paths: /collection
app.get('/exams', (req, res) => {

    let exams = db.getAll('Exam');
    if(exams == null ){
        console.log('No exams found');
        res.status(404);
    } else if(exams.error){ 
        res.status(400) //Bad Request
    } else {
        res.json(exams);
        res.status(200);
    }

});

app.post('/exams', (req, res) => {

    const task_group = req.body.taskgroup;
    const start_line = req.body.startline;
    const dead_line = req.body.deadline;
    const classe = req.body.classes;
    const teach = req.body.teacher; //check se esiste in users ? 

    const new_id = db.getNewId('Exam');
    if(new_id == -1){
        console.log('Error of new Id');
    } else {
        let exams = db.getAll('Exam');
        if(exams.error){ //generic error 
            res.status(400); //Bad Request
        } else {
            //manca controllo. NON DEVE INSERIRE ID ALTRIMENTI LO SOVRASCRIVE
            if(task_group==null || classe == null || dead_line ==null || teach == null){ //params required
                res.status(400) //Bad Request
                console.log('Params required cannot be null');
            } else {
                const new_exam =  {id:new_id, taskgroup: task_group, startline: start_line, deadline: dead_line, classes: classe, teacher: teach};
                db.addItem('Exam', new_exam);
                let exams = db.getAll('Exam');
                res.json(exams);
                console.log(exams);
                console.log('Exam created');
                res.status(201);
            }
        }
        
    }

});


app.delete('/exams', (req, res) => {
    db.deleteAll('Exam');
    console.log('Deleted all the exams');
    res.sendStatus(204); // delete, no content
    let exams = db.getAll('Exam');
    if(exams.error){ //error 
        res.status(400); //Bad Request
    } 

});


// paths: /collection/:item
app.get('/exams/:examId', (req, res) => {

    const id = req.params.examId;
    let exam = db.getById('Exam', id);
    console.log(id) //id=1
    if(exam == null){
        console.log('Exam not found');
        res.status(404); 

    } else if(exam.error){ 

        res.status(400);

    } else {

        res.json(exam);
        res.status(200);
    }
});


app.post('/exams/:examId', (req, res) => {
    //NON È SUPPORTATO UNA POST SU ID SPECIFICO
    console.log('Bad Request');
    res.status(400); 
});


app.put('/exams/:examId', (req, res) => {
    
    const id = req.params.examId;
    let exam = db.getById('Exam', id);
    if(!exam){ //exam == false ?
        console.log('Exam not found');
        res.status(404);
        return;
    }

    const task_group = req.body.taskgroup
    const start_line = req.body.startline
    const dead_line = req.body.deadline
    const classe = req.body.classes
    const teach = req.body.teacher

    //params required
    if(task_group!=null){
        exam.taskgroup = task_group;
    }
    if(classe!=null){
        exam.classes=classe;
    }
    if(dead_line!=null){
        exam.deadline = dead_line;
    }

    if(start_line!=null){
        exam.startline = start_line;
    }
    if(teach!=null){
        exam.teacher = teach;
    }

    db.updateItem('Exam', exam);

    //manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID
    
    let exams = db.getAll('Exam');

    console.log('Exam Updated');
    res.status(200);
    res.json(exams);


//fai un form ? per prendere in input cambiamenti dell'utente

})

app.delete('/exams/:examId', (req, res) => {

    const id = req.params.examId; 
    let exam = db.getById('Exam', id);
    if(!exam){
        console.log('Exam not found')
        res.status(404) //Exam not found
    } else {
        db.deleteById('Exam', id);
        res.json(db.getAll('Exam')); //controllo se è stato eliminato
        res.status(204);
    }
})

app.use((req,res,next) => {
    res.status(404).json('Error: Content not Found. Try something else')
});

module.exports = {app}

app.listen(PORT,() => console.log('Listening on port ' + PORT ))


