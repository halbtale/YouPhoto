const express = require('express');
const serverless = require('serverless-http');
const imagesRouter = require(`${__dirname}/routes/imagesRouter`);
const cors = require('cors');

// Connect DB
require(`${__dirname}/database/connectDb`);

// Initializate express app
const app = express();

// Cors
app.use(cors());

// Api routers
app.use('/.netlify/functions/api/images', imagesRouter);

module.exports = app;
module.exports.handler = serverless(app);
