const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const SOME_NUM = process.env.def || 40

// database temporaneo di test
var classes = [
    {id: 21, name: 'Siamo Veramente Euforici', participants: ['Tommaso', 'Sebastiano', 'Marta', 'Mattia', 'Leonardo']}, //come gli passo gli utenti?
    {id: 28, name: 'Povolesi', participants: ['user1', 'user1', 'user1', 'user1']},
    {id: 33, name: 'Heroku Siffredi', participants:['user2', 'user2', 'user2', 'user2']},
    {id: 47, name: 'JSONnambuli', participants:['user3', 'user3', 'user3', 'user3']}
];

// v1/classes

// GET /classes (READY)
app.get('/classes', (req, res) => {
    if(classes.length == 0) {
        res.status(404).send('http status code: 404 - We are sorry. No classes found.');
    } else {
        res.status(200);
        res.json(classes);
    }
});

// POST /classes (READY)
app.post('/classes', (req, res) => {
    const class_id = (classes.length + 1);
    const class_name = req.body.name;
    const class_participants = req.body.participants;
    if(class_name == null || class_participants == null) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else {
        const new_class = {id: class_id, name: class_name, participants: class_participants};
        classes.push(new_class);
        res.status(201);
        res.json(new_class);
    }
});

// DELETE /classes (READY)
app.delete('/classes', (req, res) => {
    classes = [];
    console.log(1);
    res.status(204);
});

// v1/classes/{classId}

// GET /classes/{classId} (READY)
app.get('/classes/:classId', (req, res) => {
    const id = req.params.classId; 
    if(isNaN(id)) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id == null) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id <= 0) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if((id % 1) != 0) {
        console.log(4);
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else {
        const temp = classes.find(c => c.id === parseInt(req.params.classId));
        // console.log(temp);
        if(temp == null) {
            res.status(404).send('http status code: 404 - We are sorry. No class found with the given ID');
        } else {
            res.status(200);
            res.json(temp);
        }
    }
});

// PUT /classes/{classId} (READY)
app.put('/classes/:classId', (req, res) => {
    const id = req.params.classId; 
    if(isNaN(id)) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id == null) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id <= 0) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if((id % 1) != 0) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else {
        const temp = classes.find(c => c.id === parseInt(req.params.classId));
        if(temp == null) {
            res.status(404).send('http status code: 404 - We are sorry. No class found with the given ID.');
        } else {
            const index = classes.indexOf(temp);
            const class_name = req.body.name;
            const class_participants = req.body.participants;
            if(class_name != null) {
                classes[index].name = class_name;
            }
            if(class_participants != null) {
                classes[index].participants = class_participants;
            }
            res.status(200);
            res.json(classes[index]);
        }
    }
});

// DELETE /classes/{classId} (READY)
app.delete('/classes/:classId', (req, res) => {
    const id = req.params.classId; 
    if(isNaN(id)) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id == null) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if(id <= 0) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else if((id % 1) != 0) {
        res.status(400).send('http status code: 400 - Ops! Something went wrong.');
    } else {
        const temp = classes.find(c => c.id === parseInt(req.params.classId));
        if(temp == null) {
            res.status(404).send('http status code: 404 - We are sorry. No class found with the given ID');
        } else {
            const index = classes.indexOf(temp);
            classes.splice(index, 1);
            res.status(204);
        }
    }
});

module.exports = {app};

app.listen(PORT, () => console.log('Example app listening on port'+ PORT));