
const serverless = require('serverless-http');
const express = require('express')
const path = require('path');
const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

module.exports.handler = serverless(app);
