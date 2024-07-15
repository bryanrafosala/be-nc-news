const express = require("express");
const { customErrorHandler, handle404 } = require("./error.handling.js");
const {
  fetchEndPoints,
  fetchTopics,
} = require("./controller/app.controllers.js");
const endpoints = require('../endpoints.json')
 

const app = express();

app.get("/api", fetchEndPoints);

app.get("/api/topics", fetchTopics);

app.use(customErrorHandler);

module.exports = app;
