const express = require("express");
const {
  fetchEndPoints,
  fetchTopics,
  fetchArticlesByID,
  fetchArticles
} = require("./controller/app.controllers.js");

const app = express();

app.get("/api", fetchEndPoints);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticlesByID);

app.get('/api/articles', fetchArticles);






// 400 Error handler
app.use((err, req, res, next) => {
    if (err.code === "23502" || err.code === "22P02") {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
  });

// 404 Error handler
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "404: Not Found" });
  next();
});

// Custom Error handler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

// 500 Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500: Internal Server Error" });
});

module.exports = app;
