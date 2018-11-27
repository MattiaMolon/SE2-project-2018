const express = require('express')
var bodyParser = require ('body-parser')
const app = express()

app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

var usersList = [
    {
        id: 1, 
        name: 'Piero', 
        surname: 'Grasso', 
        uniNumber: 182930, 
        isTeacher: true, 
        email: 'piero@grasso.it', 
        password: 'abc123',
        examsList: ['Logic', 'Math']
    },
    {
        id: 2, 
        name: 'Giovanni', 
        surname: 'Guru', 
        uniNumber: 156789, 
        isTeacher: false, 
        email: 'giovanniGuru@uni.it', 
        password: '123abc',
        examsList: ['Italian', 'Math']
    },
    {
        id: 3, 
        name: 'Aurora', 
        surname: 'Gelmini', 
        uniNumber: 182930, 
        isTeacher: true, 
        email: 'aurora.gelmini@unitn.it', 
        password: '098qwe',
        examsList: ['Logic', 'Italian']
    }
]

app.get('/', (req, res) => res.send('Hello, I am Toby, your personal assistant'))

app.get('/users', (req, res) => {
    res.status(200)
    res.json(usersList)
    console.log('Print of all the users successfully executed')
})

app.get('/users/:userId', (req, res) => {
    var user = usersList.find(tmp => tmp.id === parseInt(req.params.userId))

    if (user == null) {
        res.status(404).send('We are sorry, user not found')
        console.log('We are sorry, user not found')
    } else {
        res.status(200)
        res.json(user)
        console.log('Print of the user successfully executed')
    }
})

// quando creo un nuovo user ovviamente non ha esami registrati, però dovrei dire se è un insegnante oppure no?
app.post('/users', (req, res) => {
    const newId = usersList.length+1
    const newEmail = req.body.email
    const newUniNumber = req.body.uniNumber
    const newPassword = req.body.password
    const newName = req.body.name
    const newSurname = req.body.surname
    const newExamsList = req.body.examsList

    const newUser = {id: newId, name: newName, surname: newSurname, uniNumber: newUniNumber, email: newEmail, password: newPassword, examsList: newExamsList}

    usersList.push(newUser)

    res.status(201)
    res.json(usersList)
    console.log('User created successfully')
})

app.put('/users', (req, res) => {
    // cosa ci mettiamo qui? 
})

app.put('/users/:userId', (req, res) => {

    const userCurrent = usersList.find(tmp => tmp.id === parseInt(req.params.userId))

    if (userCurrent == null) {
        res.status(404).send('We are sorry, user not found')
        console.log('We are sorry, user not found')
    } else {
        
        const index = usersList.indexOf(userCurrent)

        // assegno i parametri a prescindere
        const newEmail = req.body.email;
        const newUniNumber = req.body.uniNumber;
        const newPassword = req.body.password;
        const newName = req.body.name;
        const newSurname = req.body.surname;
        const newExamsList = req.body.examsList;

        // qui cambio effettivamente le cose da cambiare
        if (newEmail != null) {
            usersList[index].email = newEmail
        }

        if (newUniNumber != null) {
            usersList[index].uniNumber = newUniNumber
        }

        if (newPassword != null) {
            usersList[index].password = newPassword
        }

        if (newName != null) {
            usersList[index].name = newName
        }

        if (newSurname != null) {
            usersList[index].surname = newSurname
        }
        
        if (newExamsList != null) {
            usersList[index].examsList = newExamsList
        }
        
        // da aggiungere examsList, ovvero gli esami che fa quella persona

        res.status(204);
        res.json(usersList[index]);
        console.log('User updated successfully')
    }

})

app.delete('/users', (req, res) => {
    usersList.splice(0, usersList.length)

    res.status(204)
    res.json(usersList)
    console.log('All the users have been deleted successfully')
})

app.delete('/users/:userId', (req, res) => {
    const user = usersList.find(tmp => tmp.id === parseInt(req.params.userId))

    if (user == null) {
        res.status(404).send('We are sorry, user not found')
        console.log('We are sorry, user not found')
    } else { 
        const index = usersList.indexOf(user)
        console.log('Eliminando ', req.params.userId)
        usersList.splice(index, 1)    
        console.log('Utenti attualmente registrati: ', usersList)
        res.status(204)
        res.json(usersList)
    }
})

module.exports = {app}

app.listen(PORT, () => console.log('sto ascoltando sulla porta (?)'))
