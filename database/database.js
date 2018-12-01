let database = {
    User: [
        {
            id: 1, 
            name: 'Piero', 
            surname: 'Grasso', 
            uniNumber: 182930, 
            isTeacher: true, 
            email: 'piero@grasso.it', 
            password: 'abc123',
            examsList: [1,2]
        },
        {
            id: 2, 
            name: 'Giovanni', 
            surname: 'Guru', 
            uniNumber: 156789, 
            isTeacher: false, 
            email: 'giovanniGuru@uni.it', 
            password: '123abc',
            examsList: [1,3]
        },
        {
            id: 3, 
            name: 'Aurora', 
            surname: 'Gelmini', 
            uniNumber: 182930, 
            isTeacher: true, 
            email: 'aurora.gelmini@unitn.it', 
            password: '098qwe',
            examsList: [3]
        }
    ],
    Class: [
        {   
            id: 1, 
            name: 'Siamo Veramente Euforici', 
            participants: ['Tommaso', 'Sebastiano', 'Marta', 'Mattia', 'Leonardo']
        }, 
        {
            id: 2, 
            name: 'Povolesi', 
            participants: ['user1', 'user1', 'user1', 'user1']
        },
        {
            id: 3, 
            name: 'Heroku Siffredi', 
            participants:['user2', 'user2', 'user2', 'user2']
        },
        {
            id: 4, 
            name: 'JSONnambuli', 
            participants:['user3', 'user3', 'user3', 'user3']
        }
    ],
    Task:[
        {
            id : 1,
            question: 'domanda1',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3', 'ris4'],
            answers: ['ris1', 'ris2'],
            teacher: 'teacher1'
        },
        {
            id : 2,
            question: 'domanda2',
            questionType: 'multipleChoice',
            choices: ['ris1', 'ris2', 'ris3'],
            answers: ['ris3'],
            teacher: 'teacher2'
        },
        {
            id : 3,
            question: 'domanda3',
            questionType: 'openAnswer',
            choices: undefined,
            answers: undefined,
            teacher: 'teacher3'
        }
    ],
    TaskGroup: [
        {
            id: 1, 
            name: 'taskgroup1', 
            numberTasks: 2,  
            tasks: [1,2]
        },
        {
            id: 2, 
            name:'taskgroup2', 
            numberTasks: 1, 
            tasks: [3]
        },
        {
            id: 3, 
            name:'taskgroup3', 
            numberTasks: 3, 
            tasks: [1,2,3]
        }
    ],
    Exam: [
        {
            id:1, 
            taskgroup: 2, 
            startline: 24, 
            deadline: 30, 
            classes: [1,2]
        },
        {
            id: 2, 
            taskgroup: 1, 
            startline: 1, 
            deadline: 15, 
            classes: [3]
        },
        {
            id: 3, 
            taskgroup: 3, 
            startline: 5, 
            deadline: 20, 
            classes: [4]
        }
    ],
    Review: [],
    Submission: []
};

/**
 * prende l'item e una tabella del database e aggiunge l'elemento alla tabella
 * @param {String} tabella il nome della tabella in cui aggiornare l'elemento
 * @param {Object} item l'item da aggiungere, già contenente l'id
 * @returns true se va a buon fine false altrimenti
 */
const addItem =  (tabella, item) => {
    switch (tabella){
        case 'User' :
            database.User.push(item);
            return true;
        case 'Class' :
            database.Class.push(item);
            return true;
        case 'Task' :
            database.Task.push(item);
            return true;
        case 'TaskGroup' :
            database.TaskGroup.push(item);
            return true;
        case 'Exam' :
            database.Exam.push(item);
            return true;
        case 'Review' :
            database.Review.push(item);
            return true;
        case 'Submission' :
            database.Submission.push(item);
            return true;
    }

    return false;
}


/**
 * aggiorna l'item passato nella tabella specificata
 * @param {String} tabella il nome della tabella da cui prendere l'elemento
 * @param {Object} item l'elemento da aggiornare
 * @returns true se va a buon fine false altrimenti 
 */
const updateItem = (tabella, item) => {
    let vettore = null;
    
    switch (tabella){
        case 'User' :
            vettore = database.User;
            break;
        case 'Class' :
            vettore = database.Class;
            break;
        case 'Task' :
            vettore = database.Task;
            break;
        case 'TaskGroup' :
            vettore = database.TaskGroup;
            break;
        case 'Exam' :
            vettore = database.Exam;
            break;
        case 'Review' :
            vettore = database.Review;
            break;    
        case 'Submission' :
            vettore =  database.Submission;
            break;
    }

    for( let i = 0; i<vettore.length; i++){
        if (vettore[i].id == item.id){
            vettore[i] = item;
            database[tabella] = vettore;
            return true;
        }
    }

    return false;
}


/**
 * elimina in base all'id e alla tabella specificata l'item corrispondente se esiste
 * @param {String} tabella il nome della tabella da cui prendere l'elemento
 * @param {Number} id l'id dell'elemento richiesto
 * @returns true se va a buon fine false altrimenti 
 */
const deleteById =  (tabella, id) => {
    
    let vettore = null;
    
    switch (tabella){
        case 'User' :
            vettore = database.User;
            break;
        case 'Class' :
            vettore = database.Class;
            break;
        case 'Task' :
            vettore = database.Task;
            break;
        case 'TaskGroup' :
            vettore = database.TaskGroup;
            break;
        case 'Exam' :
            vettore = database.Exam;
            break;
        case 'Review' :
            vettore = database.Review;
            break;    
        case 'Submission' :
            vettore =  database.Submission;
            break;
    }

    for( let i = 0; i<vettore.length; i++){
        if (vettore[i].id == id){
            vettore.splice(i, 1);
            database[tabella] = vettore;
            return true;
        }
    }

    return false;
}


/**
 * prende in base all'id e alla tabella specificata l'item corrispondente se esiste
 * @param {String} tabella il nome della tabella da cui prendere l'elemento
 * @param {Number} id l'id dell'elemento richiesto
 * @returns null nel caso non sia stato trovato l'elemento richiesto altrimenti l'elemento
 */
const getById =  (tabella, id) => {

    let vettore = null;

    switch (tabella){
        case 'User' :
            vettore = database.User;
            break;
        case 'Class' :
            vettore = database.Class;
            break;
        case 'Task' :
            vettore = database.Task;
            break;
        case 'TaskGroup' :
            vettore = database.TaskGroup;
            break;
        case 'Exam' :
            vettore = database.Exam;
            break;
        case 'Review' :
            vettore = database.Review;
            break;    
        case 'Submission' :
            vettore =  database.Submission;
            break;
    }

    for (let i = 0; i<vettore.length ; i++){
        if(vettore[i].id == id){
            return vettore[i];
        }
    }

    return null;
}


/**
 * elimina dal database la tabella richiesta
 * @param {String} tabella il nome della tabella da eliminare
 * @returns true se va a buon fine false altrimenti
 */
const deleteAll = (tabella) => {
    switch (tabella){
        case 'User' :
            database.User = [];
            return true;
        case 'Class' :
            database.Class = [];
            return true;
        case 'Task' :
            database.Task = []; 
            return true;
        case 'TaskGroup' :
            database.TaskGroup = [];
            return true;
        case 'Exam' :
            database.Exam = [];
            return true;
        case 'Review' :
            database.Review = [];
            return true; 
        case 'Submission' :
            database.Submission = [];
            return true;
    }

    return false;
}


/**
 * prende dal database la tabella richiesta
 * @param {String} tabella il nome della tabella da ritornare
 * @returns true se va a buon fine false altrimenti
 */
const getAll = (tabella) => {
    switch (tabella){
        case 'User' :
            return database.User;
        case 'Class' :
            return database.Class;
        case 'Task' :
            return database.Task;
        case 'TaskGroup' :
            return database.TaskGroup;
        case 'Exam' :
            return database.Exam;
        case 'Review' :
            return database.Review;
        case 'Submission' :
            return database.Submission;
    }

    return null;
}


module.exports = {getAll, getById, deleteAll, deleteById, addItem, updateItem};