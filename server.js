var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

mongoose.connect('mongodb://localhost:27017/aklesia_db');

const port = process.env.PORT || '3000';
app.set('port',port);
const server = http.createServer(app);
server.listen(port,()=> console.log(`Running on localhost: ${port}`));