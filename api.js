const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database/database');


const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require('./v1/class').registerClasses(app, db);
require('./v1/exam').registerExams(app, db);
require('./v1/review').registerReview(app, db);
require('./v1/submission').registerSubmission(app, db);
require('./v1/taskGroup').registerTaskGroup(app, db);
require('./v1/tasks').registerTask(app, db);
require('./v1/user').registerUser(app, db);


app.listen(PORT, () => console.log('Example app listening on port'+ PORT))