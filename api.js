const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


const user = require('./v1/user');



app.get('/', (req, res) => res.send('Hello World!'))

user.app.get('/exams', (req,res) =>  fetch(root + '/' + id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }));





app.listen(PORT, () => console.log('Example app listening on port'+ PORT))





