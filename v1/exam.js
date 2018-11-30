const express = require('express')
var bodyParser = require('body-parser')
const app = express()
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

let exams = [
            {id:1, taskgroup: null, startline: 24, deadline: 30, classes: null , teacher: "a"},
            {id: 2, taskgroup: null, startline: 1, deadline: 15, classes: 5 , teacher: "b" },
            {id: 3, taskgroup: null, startline: 5, deadline: 20, classes: 4, teacher: "c"}
            ]


//root
app.get('/', (req, res) => res.send('Hi! This is the root page. Here you can find only Exams'))

// paths: /collection
app.get('/exams', (req, res) => {
   
    if(exams == null ){
        console.log('No exams found')
        res.status(404)
    } else if(exams.error){ //error 
        res.status(400) //Bad Request
    } else {
        res.json(exams)
        res.status(200)
    }

})

app.post('/exams', (req, res) => {

    const task_group = req.body.taskgroup
    const start_line = req.body.startline
    const dead_line = req.body.deadline
    const classe = req.body.classes
    const teach = req.body.teacher
    const new_id = exams.length +1

    //manca controllo. NON DEVE INSERIRE ID ALTRIMENTI LO SOVRASCRIVE
    if(task_group==null || classe == null || dead_line ==null || teach == null){ //params required
        res.status(400) //Bad Request
        console.log('Params required cannot be null')
    } else {
        const new_exam =  {id:new_id, taskgroup: task_group, startline: start_line, deadline: dead_line, classes: classe, teacher: teach} 
        exams.push(new_exam)

        res.json(exams)
        console.log(exams)
        console.log('Exam created')
        res.status(201)
    }

    if(exams.error){ //generic error 
        res.status(400) //Bad Request
    } 

})

app.put('/exams', (req, res) => {

    const task_group = req.body.taskgroup
    const start_line = req.body.startline
    const dead_line = req.body.deadline
    const classe = req.body.classes
    const teach = req.body.teacher

    //params required  
    if(task_group === null){
        console.log('Bad Request')
        res.status(400) //Bad Request
        return;
    }
    if(classe === null){
        console.log('Bad Request')
        res.status(400) //Bad Request
        return;
    }
    if(dead_line === null){ 
        console.log('Bad Request')
        res.status(400) //Bad Request
        return;
    }
    if(teach === null){ 
        console.log('Bad Request')
        res.status(400) //Bad Request
        return;
    }

    //manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID

    for(i=0; i< exams.length; i++){
        let ex = exams[i];
        if(! (task_group == null)) {
            ex.taskgroup = task_group;     
        }
        if(!(start_line == null)){
            ex.startline = start_line;
        }
        if(!(dead_line == null)){
            ex.deadline = dead_line;
        }
        if(!(classe == null)){
            ex.classes=classe;
        }
        if(!(teach == null)){
            ex.teacher = teach
        }
    }
    res.status(200)
    res.send(exams)
    if(exams.error){ //error 
        res.status(400) //Bad Request
    } 
})

app.delete('/exams', (req, res) => {

    exams.splice(0, exams.length)
    console.log('Deleted all the exams')
    res.sendStatus(204) // delete, no content
    if(exams.error){ //error 
        res.status(400) //Bad Request
    } 

})


// paths: /collection/:item
app.get('/exams/:examId', (req, res) => {

    const exam = exams.find(ex => ex.id === parseInt(req.params.examId)); 
    console.log(req.params.examId) //id=1
    if(exam == null){

        console.log('Exam not found')
        res.status(404) //Exam not foun

    } else if(exams.error){ //error 

        res.status(400) //Bad Request

    } else {

        res.json(exam)
        res.status(200)
    }
})


app.post('/exams/:examId', (req, res) => {

    //NON È SUPPORTATO UNA POST SU ID SPECIFICO
    console.log('Bad Request')
    res.status(400) //Bad Request

})


app.put('/exams/:examId', (req, res) => {
    
    const exam = exams.find(ex => ex.id === parseInt(req.params.examId));

    if(!exam){
        console.log('Exam not found')
        res.status(404) //Exam not found
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

    if(exam.error){ 
        res.status(400) //Bad Request
        return;
    }

    //manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID
    
    console.log('Exam Updated')
    res.status(200)
    res.json(exams)


//fai un form ? per prendere in input cambiamenti dell'utente

})

app.delete('/exams/:examId', (req, res) => {

    const exam = exams.find(ex => ex.id === parseInt(req.params.examId)); 
    if(!exam){
        console.log('Exam not found')
        res.status(404) //Exam not found
    } else {
        const index = exams.indexOf(exam)
        exams.splice(index,1) 
        res.json(exams) //controllo se è stato eliminato
        res.status(204)
    }
})

app.use((req,res,next) => {
    res.status(404).json('Error: Content not Found. Try something else')
});


app.listen(PORT,() => console.log('Listening on port ' + PORT ))


