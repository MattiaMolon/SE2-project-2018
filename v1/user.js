const tableUser = 'User';

// Funzione per controlllare che un id sia scritto giusto
function isNum(num, res) {
    let corretto = true;

    if(isNaN(num) ) {
        //res.status(400).json(
        corretto = false; ////console.log(1); 
        //console.log('We are sorry, but the ID passed is not a number - bad request 400');
    }
    else if(num == null) {
        //res.status(400).json('We are sorry, but you did\'t pass any ID - bad request 400');
        corretto = false; ////console.log(2);
        //console.log('We are sorry, but you did\'t pass any ID - bad request 400');
    }
    else if(num <= 0  ) {
        //res.status(400).json('We are sorry, but the ID passed is lower than 0 - bad request 400');
        corretto = false; ////console.log(3);
        //console.log('We are sorry, but the ID passed is lower than 0 - bad request 400');
    }
    else if((num % 1) != 0) {
        //res.status(400).json('We are sorry, but the ID passed is not an integer - bad request 400');
        corretto = false; ////console.log(4);
        //console.log(text);
    }

    // console.log('------'+num+'--------'+corretto+'------');
    return corretto;
}

function errore(res, errorType, text="") {
    let message = {
        statusCode: undefined,
        description: undefined
    }
    
    if (text != null) {
        message.description = text;
    } else {
        switch (errorType) {
            case 400:
                message.description = 'Ops! Something went wrong - Bad request 400';
                break;
            case 404:
                message.description = 'We are sorry! No class found - Error 404';
                break;
            case 409:
                message.description = 'Ops! There are some conflicts - Conflict 409';
                break;
        }
    }

    if(errorType == 400) {
        message.statusCode = errorType;
    }
    if(errorType == 404) {
        message.statusCode = errorType;
    }
    if(errorType == 409) {
        message.statusCode = errorType;
    }

    res.status(errorType).json(message);
}

exports.registerUser = (app, db) =>{
    app.get('/users', (req, res) => {

        let usersList = db.getAll(tableUser);

        if (usersList.length == 0) {
            errore(res, 404, 'We are sorry, user not found - error 404');
            //res.status(404).json('We are sorry, user not found - error 404');
            //console.log('Sorry, no user found - error 404');
        } else {
            res.status(200).json(usersList);
            //console.log('Print of all the users successfully executed')
        }
    })

    app.get('/users/:userId', (req, res) => {
        if (isNum(+req.params.userId, res)){
            // console.log(tmpId);
            let user = db.getById(tableUser, +req.params.userId);
            // console.log(user);
            if (user == null) {
                // console.log('-------------sono dentro a user == null------------------');
                errore(res, 404, 'We are sorry, user not found - error 404');
                //res.status(404).json('We are sorry, user not found - error 404');
                //console.log('We are sorry, user not found - error 404')
            } else if (user.error) {
                errore(res, 400, 'We are sorry, there was a general error - bad request 400');
                //res.status(400).json('We are sorry, there was a general error - bad request 400')
                //console.log('We are sorry, there was a general error - bad request 400');
            } else {
                res.status(200).json(user);
                //console.log('Print of the user successfully executed')
            }
        } else {
            //console.log('------------------------------è fallita isNum----------------');
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
        
    });

    app.post('/users', (req, res) => {
        
        const newId = db.getNewId(tableUser);
        
        let newEmail = req.body.email
        let newUniNumber = req.body.uniNumber
        let newIsTeacher = req.body.isTeacher
        let newPassword = req.body.password
        let newName = req.body.name
        let newSurname = req.body.surname
        let newExamsList = req.body.examsList
        
        if (newEmail == null || (!isNaN(newEmail))) {
            errore(res, 400, 'Ops, there was an error with the email. Please try again - bad request 400');
            //res.status(400).json('Ops, there was an error with the email. Please try again - bad request 400');
            //console.log('Ops, there was an error with the email. Please try again - bad request 400')
        } else if (newUniNumber == null || isNaN(newUniNumber) || newUniNumber <= 0 || (newUniNumber % 1) != 0) {
            errore(res, 400, 'Ops, there was an error with the uniNumber. Please try again - bad request 400');
            //res.status(400).json('Ops, there was an error with the uniNumber. Please try again - bad request 400')
            //console.log('Ops, there was an error with the uniNumber. Please try again - bad request 400')
        } else if (newPassword == null) {
            let text = 'Ops, there was an error with the password. Please try again - bad request 400';
            errore(res, 400, text);
            //res.status(400).json('Ops, there was an error with the password. Please try again - bad request 400')
            //console.log('Ops, there was an error with the password. Please try again - bad request 400')
        } else if (newName == null) {
            let text = 'Ops, there was an error with the name. Please try again - bad request 400';
            errore(res, 400, text);
            //res.status(400).json('Ops, there was an error with the name. Please try again - bad request 400')
            //console.log('Ops, there was an error with the name. Please try again - bad request 400')
        } else if (newSurname == null) {
            let text = 'Ops, there was an error with the surname. Please try again - bad request 400';
            errore(res, 400, text);
            //res.status(400).json('Ops, there was an error with the surname. Please try again - bad request 400')
            //console.log('Ops, there was an error with the surname. Please try again - bad request 400')
        } else if (newIsTeacher == null) {
            let text = 'Ops, there was an error with the role of the user. Please try again - bad request 400';
            errore(res, 400, text);
            //res.status(400).json('Ops, there was an error with the role of the user. Please try again - bad request 400')
            //console.log('Ops, there was an error with the role of the user. Please try again - bad request 400')
        } else if (!Array.isArray(newExamsList)) {
            errore(res, 400, 'Ops, there was an error with the exams list. Please try again - bad request 400');
        } else {
            let newUser = {
                id: newId, 
                name: newName, 
                surname: newSurname, 
                uniNumber: newUniNumber, 
                isTeacher: newIsTeacher, 
                email: newEmail, 
                password: newPassword, 
                examsList: newExamsList
            }

            db.addItem(tableUser, newUser);

            res.status(201).json(newUser);
            //console.log('User created successfully')
        }

    })

    app.put('/users/:userId', (req, res) => {

        // let userId = +req.params.userId;
        //console.log(userId+' prima di isNum')

        if(isNum(+req.params.userId, res)) {

            let userCurrent = db.getById(tableUser, +req.params.userId);
            // console.log(userCurrent);
            
            if (userCurrent == null) {
                //console.log('----sono dentro a userCurrent==null-------');
                errore(res, 404, 'We are sorry, user not found - error 404');
                //res.status(404).json('We are sorry, user not found - error 404');
                //console.log('We are sorry, user not found - error 404');
            } else {

                // assegno i parametri a prescindere
                let update = req.body;

                // qui controllo che i parametri required non siano null. 
                // se sono null mi tengo i parametri vecchi
                if (update.email != null) {
                    userCurrent.email = update.email;
                }
                if (update.uniNumber != null) {
                    userCurrent.uniNumber = update.uniNumber;
                }
                if (update.password != null) {
                    userCurrent.password = update.password;
                }
                if (update.name != null) {
                    userCurrent.name = update.name;
                    // console.log(update.name+' copiando parametri');
                }
                if (update.surname != null) {
                    // console.log('*********************');
                    // console.log('prima di assegnamento');
                    // console.log(update.surname);
                    // console.log(userCurrent.surname);
                    userCurrent.surname = update.surname;
                    // console.log('§§§§§§§§§§§§§§§§§§§§§§§');
                    // console.log('dopo assegnamento');
                    // console.log(update.surname);
                    // console.log(userCurrent.surname);
                    // console.log('@@@@@@@@@@@@@@@@@@@');
                }
                if (update.examsList != null) {
                    userCurrent.examsList = update.examsList;
                }
                if (update.isTeacher != null) {
                    userCurrent.isTeacher = update.isTeacher;
                    if (Boolean(userCurrent.isTeacher === true)) {
                        userCurrent.isTeacher = true;
                    }
                    if (Boolean(userCurrent.isTeacher === false)) {
                        userCurrent.isTeacher = false;
                    }
                }

                // DEBUG

                // if (typeof(userCurrent.surname) === typeof(3)){
                //     console.log('è un numero')
                // } else if (typeof(userCurrent.surname) === typeof('3')) {
                //     console.log('è una stringa')
                // }
                // console.log(update.surname); 
                // console.log(!isNaN(+update.surname+1));
                // console.log(userCurrent.surname);
                // console.log(!isNaN(+userCurrent.surname+1));

                // if (userCurrent.isTeacher) {
                //     console.log('-coversione riuscita --------> isteacher = true')
                //     console.log(1+2)
                // } else if (!userCurrent.isTeacher) {
                //     console.log('-coversione riuscita --------> isteacher = false')
                //     console.log(3+4)
                // }
                

                // qui cambio effettivamente le cose da cambiare
                if ((typeof(userCurrent.email) !== 'string')) {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid email - bad request 400');
                    //console.log(text);
                } else if (isNaN(userCurrent.uniNumber) || userCurrent.uniNumber <= 0 || (userCurrent.uniNumber % 1) != 0) {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid uniNumber - bad request 400');
                    //console.log(text);
                } else if (typeof(userCurrent.name) !== 'string' || !isNaN(+userCurrent.name+1)) {
                    let text = 'We are sorry, you didn\'t enter a valid name - bad request 400';
                    errore(res, 400, text);
                    //console.log(text);
                } else if (typeof(userCurrent.surname) !== 'string' || !isNaN(+userCurrent.surname+1)) {
                    let text = 'We are sorry, you didn\'t enter a valid surname - bad request 400';
                    errore(res, 400, text);
                    //console.log(text);
                } else if ((typeof(userCurrent.isTeacher) !== 'boolean') || ((userCurrent.isTeacher != false) && (userCurrent.isTeacher != true))) {
                    let text = 'We are sorry, but we need to know if '+userCurrent.uniNumber+' is are a teacher or a student - bad request 400';
                    errore(res, 400, text);
                    //console.log(text+'\n-----'+(typeof(userCurrent.isTeacher) !== 'boolean'));
                } else {
                    db.updateItem(tableUser, userCurrent);

                    res.status(200).json(userCurrent);
                    //console.log('User updated successfully')
                }
            }
        } else {
            //console.log('------------------------------è fallita isNum----------------');
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
        // console.log('___________________________________________________________________________________')
    });

    app.delete('/users', (req, res) => {

        if(db.deleteAll(tableUser)){
            res.status(200).json('Deleted successful')
            //console.log('All the users have been deleted successfully');
        } else {
            errore(res, 400);
            //res.status(400)
        }
        
    })

    app.delete('/users/:userId', (req, res) => {
        
        let userId = +req.params.userId;
        // console.log(userId);

        //let usersList = db.getAll(tableUser);

        if(isNum(userId, res)) {

            let userCurrent = db.getById(tableUser, +req.params.userId);

            if (userCurrent == null) {
                errore(res, 404, 'We are sorry, user not found - error 404');
                //res.status(404)
                //console.log('We are sorry, user not found')
            } else { 
                //console.log('Eliminando', userCurrent.name, userCurrent.surname);
                db.deleteById(tableUser, userId);
                //usersList = db.getAll(tableUser);
                //console.log('Utenti attualmente registrati: ', usersList)
                res.status(200).json(db.getAll(tableUser))
            }
        } else {
            //console.log('------------------------------è fallita isNum----------------');
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
    })
}