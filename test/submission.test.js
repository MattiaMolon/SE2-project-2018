const app = require('../v1/submission');
const db = require('../database/database');
const PORT = process.env.SERVER_URL || 3000;
const urlClass = "http://localhost:"+PORT+"/submission";
const fetch = require('node-fetch');
const tableClass = 'Submission';