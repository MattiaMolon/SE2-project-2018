///// UTILI /////

// Funzione di errore 400
function error400 (res) {
    let message = {
        codiceDiStato: 400,
        message: 'We\'re sorry. Something went wrong! But there is remo'
    }
    res.status(400).json(message);
}

// Funzione di errore 404
function error404 (res) {
    let message = {
        codiceDiStato: 404,
        message: 'We\'re sorry. No task/s found'
    }
    res.status(404).json(message);
}

// Funzione di errore 409
function error409 (res) {
    let message = {
        codiceDiStato: 409,
        message: 'Ops! It seems there are some conflicts.'
    }
    res.status(409).json(message);
}

// Funzione per controllare che un oggetto sia una stringa
function isString (x){
    return (typeof x === "string" || x instanceof String);
}

// Funzione per controlllare che un id sia scritto giusto
function isIdCorrect(taskId, res){
    let corretto = true;

    if( isNaN(taskId) ){
        error400(res); 
        corretto = false; //console.log(1); 
    }
    else if(taskId == ''){
        error400(res);
        corretto = false; //console.log(2);
    }
    else if( taskId < 0  ){
        error400(res);
        corretto = false; //console.log(3);
    }
    else if ( taskId % 1 != 0 ){
        error400(res);
        corretto = false; //console.log(4);
    }

    return corretto;
}



///// METODI ///// 
// GET /tasks
exports.registerTask = (app, db) =>{
    app.get('/tasks', (req, res) => {
        
        tasks = db.getAll('Task');

        if(tasks.length == 0){
            error404(res);
        }
        else{
            res.status(200).json(tasks);
        }

    });

    // POST /task
    app.post('/tasks', (req, res) => {

        risp = req.body;

        // errori
        if(risp.question == null || risp.questionType == null || risp.teacher == null){
            error400(res); //console.log(1);
        }
        else if(risp.questionType != 'multipleChoice' && risp.questionType != 'openAnswer'){
            error400(res); //console.log(2);
        }
        else if(risp.questionType == 'multipleChoice' && (risp.choices == null || risp.answers == null)){
            error400(res); //console.log(3);
        }
        else if(risp.questionType == 'openAnswer' && (risp.choices != null || risp.answers != null)){
            error400(res); //console.log(4);
        }
        else if(risp.questionType == 'multipleChoice' && (!Array.isArray(risp.choices) || !Array.isArray(risp.answers))){
            error400(res); //console.log(5);
        }
        else if(!isString(risp.question) || isNaN(risp.teacher)){
            error400(res); //console.log(6);
        }
        else if(db.getById('User', risp.teacher) == null || !db.getById('User', risp.teacher).isTeacher){
            error400(res); //console.log(7);
        }
        else{

            var isAnswersCorrect = true, isChoicesCorrect = true;

            //controllo correttezza interna del vettore delle risposte e delle scelte
            if(risp.questionType == 'multipleChoice'){
                for (let i = 0; i<risp.choices.length; i++){
                    if(!isString(risp.choices[i])){
                        isChoicesCorrect = false;
                    }
                }

                for (let i = 0; i<risp.answers.length; i++){
                    if(!isString(risp.answers[i])){
                        isAnswerCorrect = false;
                    }
                }

                var trovato = false, domandaSbagliata = false;
                for(let i = 0; i<risp.answers.length; i++){
                    for(let z = 0; z<risp.choices.length && !trovato; z++){
                        if(risp.choices[z] == risp.answers[i]){
                            trovato = true;
                        }
                    }
                    if(trovato == false){
                        domandaSbagliata = true;
                    }
                    trovato = false;
                }

                if(domandaSbagliata){
                    isAnswersCorrect = false;
                }

            }

            if(!isChoicesCorrect || !isAnswersCorrect){
                error400(res); //console.log(8);
            }
            else{
                try{

                    var newTask, newId;
                    newId = db.getNewId('Task');
    
                    if(risp.questionType == 'multipleChoice'){
                        newTask = {
                            id : newId,
                            question : risp.question,
                            questionType : 'multipleChoice',
                            choices : risp.choices,
                            answers : risp.answers,
                            teacher : risp.teacher
                        };
                    } else if(risp.questionType == 'openAnswer'){
                        newTask = {
                            id : newId,
                            question : risp.question,
                            questionType : 'openAnswer',
                            teacher : risp.teacher
                        };
                    }

                    db.addItem('Task', newTask);
                    res.status(201).json(newTask);
                
                }catch(err){
                    error400(res); //console.log(9);
                }
            }
        }
    });

    // DELETE /task
    app.delete('/tasks', (req, res) => {

        if(db.deleteAll('Task')){
            res.status(200).send("All tasks deleted");
        } else {
            error400(res);
        }
        
    });

    // GET /task/:taskId
    app.get('/tasks/:taskId', (req, res) => {

        let taskId = +req.params.taskId;

        if(isIdCorrect(taskId, res)){
            try{

                // prendo task dal database se esiste
                let taskToSend;
                taskToSend = db.getById('Task', taskId);

                // spedisco errore o il task in base alla risposta del database
                if(taskToSend == null){
                    error404(res);
                }
                else{
                    res.status(200).json(taskToSend);
                }

            }catch(err){
                error400(res); //console.log(5);
            }
        }

    });

    // DELETE /task/:taskId
    app.delete('/tasks/:taskId', (req, res) => {
        
        let taskId = +req.params.taskId;

        if(isIdCorrect(taskId, res)){
            try{

                // controllo che non appartenga a nessun taskGroup
                let taskGroups = db.getAll('TaskGroup');
                let trovato = false;
                for(let i=0; i<taskGroups.length && !trovato; i++){
                    for(let z=0; z<taskGroups[i].tasks.length && !trovato; z++){
                        if(taskGroups[i].tasks[z] == taskId){
                            error409(res); trovato = true;
                        }
                    }
                }

                if(!trovato){
                    if( db.deleteById('Task', taskId) ){
                        res.status(200).send('Task deleted');
                    }
                    else{
                        error404(res);
                    }
                }

            }catch(err){
                error400(res); //console.log(5);
            }
        }

    });

    // PUT /task/:taskId
    app.put('/tasks/:taskId', (req, res) => {
        
        taskId = +req.params.taskId;


        if( isIdCorrect(taskId, res) ){
            try{
                
                var risp = req.body;
                var oldItem = db.getById('Task', taskId);

                if( oldItem != null){

                    var sendError = false;

                    // controllo sulla domanda
                    if( risp.question != null){
                        if(isNaN(risp.question)){
                            oldItem.question = risp.question;
                        }
                        else{
                            sendError = true; //console.log(1);
                        }
                    }

                    // controllo sull'insegnante
                    if( risp.teacher != null){

                        risp.teacher = +risp.teacher;
                        let newTeacher = db.getById('User', risp.teacher);

                        if( newTeacher != null && newTeacher.isTeacher == true){
                            oldItem.teacher = risp.teacher;
                        }
                        else{
                            sendError = true; //console.log(2);
                        }
                    }

                    // controllo sul tipo di domanda
                    if( risp.questionType != null){
                        if( risp.questionType == 'multipleChoice'){
                            if( risp.choices == null || risp.answers == null || 
                                !Array.isArray(risp.choices) || !Array.isArray(risp.answers)){
                                sendError = true; //console.log(3);
                            }
                            else{
                                oldItem.questionType == 'multipleChoice';
                                oldItem.choices = risp.choices;
                                oldItem.answers = risp.answers;
                            }
                        }
                        else if (risp.questionType == 'openAnswer'){
                            oldItem.questionType = 'openAnswer';
                            oldItem.choices = undefined;
                            oldItem.answers = undefined;
                        }
                        else{
                            sendError = true; //console.log(4);
                        }
                    }

                    // controllo sulle scelte 
                    if (risp.choices != null){
                        if( Array.isArray(risp.choices) && 
                            (oldItem.questionType == 'multipleChoice' || risp.questionType == 'multipleChoice')){
                                oldItem.choices = risp.choices;
                        }
                        else{
                            sendError = true; //console.log(5);
                        }
                    }

                    // controllo le risposte
                    if (risp.answers != null){
                        if( Array.isArray(risp.answers) && 
                            (oldItem.questionType == 'multipleChoice' || risp.questionType == 'multipleChoice')){
                                oldItem.answers = risp.answers;
                        }
                        else{
                            sendError = true; //console.log(6);
                        }
                    }

                    if(sendError){
                        error409(res);
                    }
                    else{
                        db.updateItem('Task', oldItem);
                        res.status(200).json(oldItem);
                    }

                }
                else{
                    error404(res); //console.log(7);
                }
            }
            catch(err){
                error400(res); //console.log(8);
            }
        }
    });
}