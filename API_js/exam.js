const express = require('express')
var bodyParser = require('body-parser')
const app = express()
app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

let exams = [
            {id:1, taskgroup: null, startline: 24, deadline: 30, classes: null},
            {id: 2, taskgroup: null, startline: 1, deadline: 15, classes: 5},
            {id: 3, taskgroup: null, startline: 5, deadline: 20, classes: 4}
            ]


//root
app.get('/', (req, res) => res.send('Hi! This is the root page. Here you can find only Exams'))

// paths: /collection
app.get('/exams', (req, res) => {
   
    if(exams == null ){
        console.log('No exams found')
        res.status(404)
    } else if(exams.error){ //error 
        res.status(400).send('Bad Request - 400')
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
    const new_id = exams.length +1

//manca controllo. NON DEVE INSERIRE ID ALTRIMENTI LO SOVRASCRIVE
    if(task_group==null || classe == null || dead_line ==null){ //params required
        res.status(400).send('Bad Request - 400')
        return;
    }

    const new_exam =  {id:new_id, taskgroup: task_group, startline: start_line, deadline: dead_line, classes: classe} 
    exams.push(new_exam)

    res.json(exams)
    console.log(exams)
    console.log('Exam created')
    res.status(201)

    if(exams.error){ //error 
        res.status(400).send('Bad Request - 400')
    } 


})

app.put('/exams', (req, res) => {
    //trova quale modifica vuole fare. poi applicala a tutti gli items
    const task_group = req.body.taskgroup
    const start_line = req.body.startline
    const dead_line = req.body.deadline
    const classe = req.body.classes

    if(task_group==null || classe == null || dead_line ==null){ //params required
        console.log('Bad Request')
        res.status(400).send('Bad Request - 400')
        return;
    }

//manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID

    for(i=0; i< exams.length; i++){
        let ex = exams[i];
        ex.taskgroup = task_group;
        ex.startline = start_line;
        ex.deadline = dead_line;
        ex.classes=classe;
    }
    res.status(200)
    res.send(exams)
   if(exams.error){ //error 
        res.status(400).send('Bad Request - 400')
    } 
})

app.delete('/exams', (req, res) => {
    exams.splice(0, exams.length)
    console.log('Deleted all the exams')
    res.sendStatus(204) // delete, no content
    if(exams.error){ //error 
        res.status(400).send('Bad Request - 400')
    } 

})


// paths: /collection/:item
app.get('/exams/:examId', (req, res) => {
    const exam = exams.find(ex => ex.id === parseInt(req.params.examId)); 
    console.log(req.params.examId) //id=1
    if(exam == null){
        console.log('Exam not found')
        res.status(404).send('Exam not found - 404')
        return;
    }

    if(exams.error){ //error 
        res.status(400).send('Bad Request - 400')
    } 

    res.json(exam)
    res.status(200)
  
})


app.post('/exams/:examId', (req, res) => {

    //NON È SUPPORTATO UNA POST SU ID SPECIFICO
    console.log('Bad Request')
    res.status(400).send('Bad request - 400')

})


app.put('/exams/:examId', (req, res) => {
    //trova quale modifica vuole fare. Poi applicala al rispettivo items 
    const exam = exams.find(ex => ex.id === parseInt(req.params.examId));
    const task_group = req.body.taskgroup
    const start_line = req.body.startline
    const dead_line = req.body.deadline
    const classe = req.body.classes

    if(task_group==null || classe == null || dead_line ==null){ //params required
        res.status(400).send('Bad Request - 400')
        return;
    }

//manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID

    for(i=0; i< exams.length; i++){
        let ex = exam;
        ex.taskgroup = task_group;
        ex.startline = start_line;
        ex.deadline = dead_line;
        ex.classes=classe;
    }
    res.status(200)
    res.send(exams)


//fai un form ? per prendere in input cambiamenti dell'utente

    if(exam == null){
        console.log('Exam not found')
        res.status(404).send('Exam not found - 404')
        return;
    } else {

        exam.taskgroup = task_group;
        exam.startline = start_line;
        exam.deadline = dead_line;
        exam.classes = classe;
        res.send(exam)
        res.status(200).send('OK')
    }
})

app.delete('/exams/:examId', (req, res) => {
    const exam = exams.find(ex => ex.id === parseInt(req.params.examId)); 
    if(!exam){
        console.log('Exam not found')
        res.status(404).send('Exam not found - 404')
    }
    const index = exams.indexOf(exam)
    exams.splice(index,1) 
    res.json(exams) //controllo se è stato eliminato
    res.status(200)
})

app.use((req,res,next) => {
    res.status(404).json('Error: Content not Found. Try something else')
});


app.listen(PORT,() => console.log('Listening on port ' + PORT ))


