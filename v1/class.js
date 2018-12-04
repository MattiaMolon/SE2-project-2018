const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const SOME_NUM = process.env.def || 40;

// importo il database
const db = require('../database/database');

/**
 * funzione per gestire l'errore da restituire con il rispettivo json
 * @param {*} res la response della chiamata effettuata
 * @param {Number} errorType il tipo di errore
 * @returns lo status code dell'errore con il rispettivo json
 */
function errore(res, errorType) {
    let message = {
        statusCode: undefined,
        description: undefined
    }
    
    if(errorType == 400) {
        message.statusCode = errorType;
        message.description = 'Ops! Something went wrong.';
    }
    if(errorType == 404) {
        message.statusCode = errorType;
        message.description = 'We are sorry! No class found.';
    }
    if(errorType == 409) {
        message.statusCode = errorType;
        message.description = 'Ops! There are some conflicts.';
    }

    res.status(errorType).json(message);
}

/**
 * funzione che controlla se l'id passato sia corretto formalmente (no confronto con esistenza nel DB)
 * @param {Number} id 
 * @param {*} res 
 * @returns true se l'id è corretto, false altrimenti
 */
function rightId(id, res) {
    let corretto = true;

    if(isNaN(id)) {
        corretto = false;
    } else if(id == null) {
        corretto = false;
    } else if(id <= 0) {
        corretto = false;
    } else if((id % 1) != 0) {
        corretto = false;
    }

    return corretto;
}

function isString(toCheck) {
    return (typeof toCheck === "string" || toCheck instanceof String);
}

// v1/classes

// GET /classes (READY)
app.get('/classes', (req, res) => {
    try {
        let classes = db.getAll('Class');
        if(classes.length == 0) {
            errore(res, 404);
        } else {
            res.status(200).json(classes);
        }
    } catch (error) {
        console.log(error);
        errore(res, 400);
    }
});

// POST /classes (READY)
app.post('/classes', (req, res) => {
    try {
        const class_id = db.getNewId('Class');
        if (class_id == -1) {
            errore(res, 400);
        } else {
            const class_name = req.body.name;
            const class_participants = req.body.participants;
            if(class_name == null || class_participants == null) {
                errore(res, 400);
            } else {
                const new_class = {id: class_id, name: class_name, participants: class_participants};
                db.addItem('Class', new_class);
                res.status(201);
                res.json(new_class);
            }
        }
    } catch (error) {
        console.log(error);
        errore(res, 400);
    }
});

// DELETE /classes (READY)
app.delete('/classes', (req, res) => {
    try {
        if (db.deleteAll('Class')) {
            res.status(200).json('All classes have been correctly deleted');
            console.log('All classes have been correctly deleted');
        } else {
            res.status(404).json('No classes found - error 404');
            console.log('No classes found - error 404');
        }
        
    } catch(error) {
        console.log(error);
        errore(res, 400);
    }
});

// v1/classes/{classId}

// GET /classes/{classId} (READY)
app.get('/classes/:classId', (req, res) => {
    try {
        const id = req.params.classId;
        if(rightId(id)) {
            const temp = db.getById('Class', id);
            if(temp == null) {
                errore(res, 404);
            } else {
                res.status(200);
                res.json(temp);
            }
        } else {
            errore(res, 400);
        }
    } catch (error) {
        console.log(error);
        errore(res, 400);
    }
});

// PUT /classes/{classId} (READY)
app.put('/classes/:classId', (req, res) => {
    try {
        const id = req.params.classId;
        if(rightId(id)) {
            let temp = db.getById('Class', id);
            if(temp == null) {
                errore(res, 404);
            } else {
                const class_name = req.body.name;
                const class_participants = req.body.participants;
                if(class_name != null && (isString(class_name))) {
                    temp.name = class_name;
                }
                if(class_participants != null && (isString(class_name))) {
                    temp.participants = class_participants;
                }
                //console.log(temp);
                db.updateItem('Class', temp);
                res.status(200);
                res.json(temp);
            }
        } else {
            errore(res, 400);
        }
    } catch (error) {
        console.log(error);
        errore(res, 400);
    }
});

// DELETE /classes/{classId} (READY)
app.delete('/classes/:classId', (req, res) => {
    try {
        const id = req.params.classId;
        if(rightId(id)) {
            const temp = db.getById('Class', id);
            if(temp == null) {
                errore(res, 404);
            } else {
                db.deleteById('Class', temp);
                res.status(200).json('Delete successful');
            }
        } else {
            errore(res, 400);
        }
    } catch (error) {
        console.log(error);
        errore(res, 400);
    }
});

module.exports = {
    app: app,
    errore: errore,
    rightId: rightId,
    isString: isString
}

app.listen(PORT, () => console.log('Example app listening on port'+ PORT));