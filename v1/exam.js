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
function rightId(id) {
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

exports.registerExams = (app, db) =>{
    // paths: /collection
    app.get('/exams', (req, res) => {
        var exam = db.getAll('Exam');
        if(exam.length == 0) {
            errore(res, 404);
        } else {
            res.status(200).json(exam);
        }
    });

    app.post('/exams', (req, res) => {
        try {
            const exam_id = db.getNewId('Exam');
            const exam_taskgroup = req.body.taskgroup;
            const exam_startline = req.body.startline;
            const exam_deadline = req.body.deadline;
            const exam_classes = req.body.classes;
            const exam_teacher = req.body.teacher;
            if(exam_id == -1) {
                errore(res, 400);
            } else if(exam_taskgroup == null || exam_deadline == null || exam_classes == null || exam_teacher == null) {
                //console.log('entrato');
                errore(res, 400);
            } else {
                const new_exam = {id: exam_id, taskgroup: exam_taskgroup, startline: exam_startline, deadline: exam_deadline, classes: exam_classes, teacher: exam_teacher};
                db.addItem('Exam', new_exam);
                res.status(201);
                res.json(new_exam);
            }
        } catch(error) {
            //console.log(error);
            errore(res, 400);
        }
    });

    app.delete('/exams', (req, res) => {
        if(db.deleteAll('Exam')) {
            res.status(200).send('Correttamente cancellato');
        } else {
            errore(res, 404);
        }
    });

    // paths: /collection/:item
    app.get('/exams/:examId', (req, res) => {
        const id = req.params.examId;
        if(rightId(id)) {
            let exam = db.getById('Exam', id);
            if(exam == null) {
                errore(res, 404);
            } else {
                res.status(200);
                res.json(exam);
            }
        } else {
            errore(res, 400);
        }
    });

    app.put('/exams/:examId', (req, res) => {
        const id = req.params.examId;
        if(rightId(id)) {
            let exam = db.getById('Exam', id);
            if(exam == null) {
                errore(res, 404);
            } else {
                const task_group = req.body.taskgroup
                const start_line = req.body.startline
                const dead_line = req.body.deadline
                const classe = req.body.classes
                const teach = req.body.teacher

                //params required
                if(task_group!=null ){
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

                if( ((exam.taskgroup % 1)!=0) ) {
                    res.status(409).json('TaskGroup should be an integer');
                }  else if( (exam.teacher % 1) !=0) {
                    res.status(409).json('Teacher should be an integer');
                } else if( ! ( typeof (exam.deadline) === 'string') ){
                    res.status(409).json('Deadline should be a string');
                } else if( ! ( typeof (exam.startline) === 'string') ){
                    res.status(409).json('Startline should be a string');
                } /* else if ( ( exam.classe instanceof Array) ){
                    res.status(409).json('Classe should be an array');
                } */ else {
                    db.updateItem('Exam', exam);
                    //manca controllo. NON DEVE ESSERE POSSIBILE MODIFICARE L'ID
                
                    let exams = db.getAll('Exam');

                    //console.log('Exam Updated');
                    res.status(200);
                    res.json(exam); 
                }
                            
            }
        } else {
            errore(res, 400);
        }
    })

    app.delete('/exams/:examId', (req, res) => {
        const id = req.params.examId;
        if(rightId(id)) {
            let exam = db.getById('Exam', id);
            if(exam == null) {
                //console.log('Exam not found')
                errore(res, 404);
            } else {
                db.deleteById('Exam', id);
                res.status(200);
                res.json(db.getAll('Exam'));
            }
        } else {
            errore(res, 400);
        }
    });
}