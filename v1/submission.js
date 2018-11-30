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

// dobbiamo fare la put?

app.post('/submissions', (req, res) => {
    
});

// v1/submissions/{submissionId}