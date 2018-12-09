// v1/submissions
exports.registerSubmission = (app, db) =>{
    app.get('/submissions', (req, res) => {

        let db_submission = db.getAll('Submission');
    
        if(db.getAll('Submission').length == 0) {
            res.status(404).send('http status code: 404 - We are sorry. No submissions found.');
        } else {
            res.status(200);
            res.json(db_submission);
        }
    });

    app.post('/submissions', (req, res) => {

        let submission_id = db.getNewId('Submission');
    
        let submission_classID = req.body.class;
        let submission_teacherID = req.body.teacher;
        let submission_studentID = req.body.student;
        let submission_examID = req.body.exam;
        let submission_data = req.body.data;
        let submission_answer = req.body.answer;
    
        if(submission_id == null){
            res.status(400).send('Database Error! Please try later');
        } else if(submission_studentID == null || isNaN(submission_studentID)){
            res.status(400).send('Error! You must insert a valid uniNumber');
        } else if(submission_examID == null || isNaN(submission_examID)){
            res.status(400).send('Error! You must insert a valid examID'); 
        } else if(submission_classID == null || isNaN(submission_classID)){
            res.status(400).send('Error! You have to insert a valid classID'); 
        } else if(submission_answer == null || !Array.isArray(submission_answer)){
            res.status(400).send('Error! You have to insert a valid answer'); 
        }else{

            if(db.getById('Class', submission_classID) == null){
                res.status(404) //Bad Request
                console.log('Error! No Class found with given ID');
            } else if(db.getById('User', submission_studentID) == null || db.getById('User', submission_studentID).isTeacher){
                res.status(404) //Bad Request
                console.log(req.body);
                console.log('Error! No User found with given ID');
            } else if(db.getById('User', submission_teacherID) == null || !db.getById('User', submission_teacherID).isTeacher){
                res.status(404) //Bad Request
                console.log('Error! No Teacher found with given ID');
            } else if(db.getById('Exam', submission_examID) == null){
                res.status(404) //Bad Request
                console.log('Error! No Exam found with given ID');
            } else{

                const new_submission = {id: submission_id, class: submission_classID, teacher: submission_teacherID, student: submission_studentID, exam: submission_examID, data: submission_data, answer: submission_answer}
                db.addItem('Submission', new_submission);
                res.status(201);
                res.json(new_submission);

            }
    
        }
    });

    app.delete('/submissions', (req, res) => {

        let db_submission = db.getAll('Submission');

        if(db_submission.length == 0){
            res.status(400).send("Error 400 : Something went wrong!");
        }else{
            db.deleteAll('Submission');
            res.status(200).send("Sumbissions eliminated successfully!");
        }

    })

    // v1/submissions/{submissionId}

    app.get('/submissions/:submissionID', (req, res) => {

        let submission_searched = db.getById('Submission', req.params.submissionID);

        if(submission_searched == null){

            if(isNaN(req.params.submissionID) || req.params.submissionID<=0 || req.params.submissionID % 1 != 0){
                res.status(400).send('400 - We are sorry. You must insert a valid submission ID');
            } else{
                res.status(404).send('404 - We are sorry. No submission found with given id');
            }
        }
        else{
            res.json(submission_searched);
            res.status(200);
        }

    })

    app.put('/submissions/:submissionID', (req, res) =>{

        let submission_searched = db.getById('Submission', req.params.submissionID);

        if(submission_searched == null){

            if(isNaN(req.params.submissionID) || req.params.submissionID<=0 || req.params.submissionID % 1 != 0){
                res.status(400).send('400 - We are sorry. You must insert a valid submission ID');
            } else{
                res.status(404).send('404 - We are sorry. No submission found with given id');
            }
    
        }
        else{

            let update_classID = req.body.class;
            let update_teacherID = req.body.teacher;
            let update_studentID = req.body.student;
            let update_examID = req.body.exam;
            let update_data = req.body.data;
            let update_anwer = req.body.answer;

            if(update_classID!=null && isNaN(update_classID)){
                console.log('Error! You must insert a valid classID')
                res.status(400).send('Error! You must insert a valid classID')
            } else if(update_studentID!=null && isNaN(update_studentID)){
                console.log('Error! You must insert a valid studentID')
                res.status(400).send('Error! You must insert a valid studentID')
            } else if(update_teacherID!=null && isNaN(update_teacherID)){
                console.log('Error! You must insert a valid teacherID')
                res.status(400).send('Error! You must insert a valid teacherID')
            } else if(update_examID!=null && isNaN(update_examID)){
                console.log('Error! You must insert a valid examID')
                res.status(400).send('Error! You must insert a valid examID')
            } else if(update_data!=null && !isNaN(update_data)){
                console.log('Error! You must insert a valid data')
                res.status(400).send('Error! You must insert a valid data')
            } else if(update_anwer!= null && !Array.isArray(update_anwer)){
                console.log('Error! You must insert a valid answer')
                res.status(400).send('Error! You must insert a valid answer')
            } else {

                if(update_classID!=null && db.getById('Class', update_classID) == null){
                    console.log('Error! No Class found with given ID')
                    res.status(404).send('Error! No Class found with given ID')
                } else if(update_teacherID!=null && (db.getById('User', update_teacherID) == null || !db.getById('User', update_teacherID).isTeacher)){
                    console.log('Error! No teacher found with given ID')
                    res.status(404).send('Error! No Teacher found with given ID')
                } else if(update_studentID!=null && (db.getById('User', update_studentID) == null || db.getById('User', update_studentID).isTeacher)){
                    console.log('Error! No student found with given ID')
                    res.status(404).send('Error! No Student found with given ID')
                } else if(update_examID!=null && db.getById('Exam', update_examID) == null){
                    console.log('Error! No exam found with given ID')
                    res.status(404).send('Error! No Exam found with given ID')
                } else{

                    let tmpclass = (update_classID!=null) ? db.getById('Class', update_classID) : db.getById('Class', submission_searched.class);
                    let tmpstudent = (update_studentID!=null) ? db.getById('User', update_studentID) : db.getById('User', submission_searched.student);
                    let tmpteacher = (update_teacherID!=null) ? db.getById('User', update_teacherID) : db.getById('User', submission_searched.teacher);
                    let tmpexam = (update_examID!=null) ? db.getById('Exam', update_examID) : db.getById('Exam', submission_searched.exam);

                    //controllo classID
                    // if(update_classID!=null){
                    //     tmpclass = db.getById(update_classID);
                    // } else {
                    //     tmpclass = db.getById(submission_searched);
                    // }

                    // -> lo studente è tra i partecipanti dell'esame
                    let checkClass = false;
                        for(let i=0; i<=tmpclass.participants.length; i++){
                        if(tmpstudent.id == tmpclass.participants[i]){
                            checkClass = true;
                        }
                    }

                    if(checkClass){
                        submission_searched.class = tmpclass.id;
                    } else{
                        console.log('Error! Something went wrong (lo studente non è iscritto alla classe data)')
                        res.status(409).send('Error! Something went wrong (lo studente non è iscritto alla classe data)')
                    }

                    //controllo studentID

                    // -> controllo se ha l'esame nell'examList
                    let checkStudent = false;
                    for(let i=0; i<tmpstudent.examsList.length; i++){
                        if(tmpexam.id == tmpstudent.examsList[i]){
                            checkStudent = true;
                        }
                    }

                    if(checkStudent){
                        submission_searched.student = tmpstudent.id;
                    } else{
                        console.log('Error! Something went wrong (lo studente non ha il esame dato in lista)')
                        res.status(409).send('Error! Something went wrong (lo studente non ha il esame dato in lista)')
                    }

                    //controllo teacherID

                    //controllo se è il teacher asseganto all'esame

                    if(tmpexam.teacher == tmpteacher.id){
                        submission_searched.teacher = tmpteacher.id;
                    } else{
                        console.log('Error! Something went wrong (il professore dato non è assegnato al esame)')
                        res.status(409).send('Error! Something went wrong (il professore dato non è assegnato al esame)')
                    }

                    //controllo examID

                    //controllo se l'esame è assegnato alla classe data
                    let checkExam = false;
                    for(let i=0; i<tmpexam.classes.length; i++){
                        if(tmpclass.id == tmpexam.classes[i]){
                            checkExam = true;
                        }
                    }

                    if(checkExam){
                        submission_searched.exam = tmpexam.id;
                    } else{
                        console.log('Error! Something went wrong (il esame non è stato assegnato alla classe)');
                        res.status(409).send('Error! Something went wrong (il esame non è stato assegnato alla classe)')
                    }

                     //controllo data
                     if(update_data!=null){
                         submission_searched.data = update_data;
                     }

                     if(update_anwer!=null){
                         submission_searched.answer = update_anwer;
                     }

                     //controllo answer

                    //aggiorno l'elemento
                    if(db.updateItem('Submission', submission_searched)){
                        res.status(200);
                        res.json(submission_searched);
                    } else {
                        res.status(400).send("Error 400 : Update error!");
                    }

                }
            }
        }
    })

    app.delete('/submissions/:submissionID' , (req, res) =>{

        let submission_searched = db.getById('Submission', req.params.submissionID);

        if(submission_searched == null){
            if(isNaN(req.params.submissionID) || req.params.submissionID<=0 || req.params.submissionID % 1 != 0){
                res.status(400).send('400 - We are sorry. You must insert a valid submission ID');
            } else{
                res.status(404).send('404 - We are sorry. No submission found with given id');
            }
        }
        else{
            db.deleteById('Submission', submission_searched.id);
            res.status(200).send('Sumbission eliminated!')
        }

    })
}
