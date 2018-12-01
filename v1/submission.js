const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true}));

const PORT = process.env.PORT || 3000;

const SOME_NUM = process.env.def || 40

var db_submission = [
    {id: 1, class: "Siamo Veramente Euforici", teacher: "Fabio Casati", student: "Mattia Molon", exam: "Ingegneria del Software 2", data: "05/12/2018 09:00"},
    {id: 2, class: "Siamo Veramente Euforici", teacher: "Fabio Casati", student: "Sebastiano Chiari", exam: "Ingegneria del Software 2", data: "05/12/2018 09:00"},
    {id: 3, class: "Siamo Veramente Euforici", teacher: "Fabio Casati", student: "Leonardo Remondini", exam: "Ingegneria del Software 2", data: "05/12/2018 09:00"},
    {id: 4, class: "Siamo Veramente Euforici", teacher: "Fabio Casati", student: "Marta Toniolli", exam: "Ingegneria del Software 2", data: "05/12/2018 09:00"},
    {id: 5, class: "Siamo Veramente Euforici", teacher: "Fabio Casati", student: "Tommaso Bosetti", exam: "Ingegneria del Software 2", data: "05/12/2018 09:00"},
    {id: 6, class: "Siamo Veramente Euforici", teacher: "Renato Lo Cigno", student: "Marta Toniolli", exam: "Reti", data: "11/01/2019 10:00"},
    {id: 7, class: "Siamo Veramente Euforici", teacher: "Renato Lo Cigno", student: "Leonardo Remondini", exam: "Reti", data: "11/01/2019 10:00"}
];

// v1/submissions

app.get('/submissions', (req, res) => {
    if(db_submission.length == 0) {
        res.status(404).send('http status code: 404 - We are sorry. No submissions found.');
    } else {
        res.status(200);
        res.json(db_submission);
    }
});

app.post('/submissions', (req, res) => {
    const submission_id = db_submission.length + 1;
    const submission_classID = req.body.classID;
    const submission_teacherID = req.body.teacherID;
    const submission_studentID = req.body.studentID;
    const submission_examID = req.body.examID;
    const submission_data = req.body.data;

    if(submission_id == null){
        res.status(400) //Bad Request
        console.log('Database Error! Please try later');
    } else if(submission_studentID == null || isNaN(submission_studentID)){
        res.status(400) //Bad Request
        console.log('Error! You must insert a valid uniNumber');
    } else if(submission_examID == null || isNaN(submission_examID)){
        res.status(400) //Bad Request
        console.log('Error! You must insert a valid examID'); 
    } else if(submission_classID != null && isNaN(submission_classID)){
        res.status(400) //Bad Request
        console.log('Error! You have to insert a valid classID'); 
    } else{

        const new_submission = {id: submission_id, class: submission_classID, teacher: submission_teacherID, student: submission_studentID, exam: submission_examID, data: submission_data}
        db_submission.push(new_submission);
        res.status(201);
        res.json(new_submission);
        console.log(db_submission);

    }
});

app.delete('/submission', (req, res) => {

    if(db_submission.error){
        res.status(400).send("Error 400 : Something went wrong!");
    }else{
        db_submission.splice(0, db_submission.length);

        res.status(204);
        res.json(db_submission);
        console.log('All the submissions have been deleted successfully');
    }

})

// v1/submissions/{submissionId}

app.get('/submission/:submissionID', (req, res) => {

    const submission_searched = db_submission.find(s => s.id === parseInt(req.params.submissionID));

    if(submission_searched == null){
        res.status(404).send('404 - We are sorry. No submission found with given id');
    }
    else{
        res.json(submission_searched);
        res.status(200);
    }

})

app.put('/submission/:submissionID', (req, res) =>{

    const submission_searched = db_submission.find(s => s.id === parseInt(req.params.submissionID));

    if(submission_searched == null){
        res.status(404).send('404 - We are sorry. No submission found with given id');
    }
    else{

        const index = db_submission.indexOf(submission_searched);
        const update_classID = req.body.classID;
        const update_teacherID = req.body.teacherID;
        const update_studentID = req.body.studentID;
        const update_examID = req.body.examID;
        const update_data = req.body.data;

        if(update_studentID!=null && update_studentID.isNaN()){
            db_submission[index].studentID= update_studentID;
        } else if(update_studentID==null || !update_studentID.isNaN()){
            res.status(400).send('Error! You must insert a valid studentID')
        } else if(update_examID!=null && update_examID.isNaN()){
            db_submission[index].examID= update_examID;
        } else if(update_examID==null || !update_examID.isNaN()){
            res.status(400).send('Error! You must insert a valid examID')
        } else if(update_teacherID!=null && update_teacherID.isNaN()){
            db_submission[index].teacherID= update_teacherID;
        } else if(update_teacherID!=null && !update_teacherID.isNaN()){
            res.status(400).send('Error! You must insert a valid teacherID')
        } else if(update_data!=null){
            db_submission[index].data= update_data;
        } else if(update_data!=null && (!update_data.isNaN() && !(update.data instanceof String))){
            res.status(400).send('Error! You must insert a valid data')
        } else {

            res.status(204);
            res.json(taskGroups_offered[index]);
            console.log('Submission has been updated successfully');

        }

    }

})

app.delete('/submission/:submissionID' , (req, res) =>{

    const submission_searched = db_submission.find(s => s.id === parseInt(req.params.submissionID));
    const index = db_submission.indexOf(submission_searched);

    if(submission_searched == null){
        res.status(404).send('404 - We are sorry. No submission found with given id');
    }
    else{
        db_submission.splice(index, 1);
        res.json(submission_searched);
        res.status(200);
    }

})

app.listen(PORT,() => console.log('Listen on port '+PORT));

