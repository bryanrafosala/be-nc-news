const express = require("express");
const {
  fetchEndPoints,
  fetchTopics,
  fetchArticlesByID,
  fetchArticles,
  patchArticle
} = require("./controller/app.controllers.js");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById
} = require("./controller/comment.controller.js");
const cors = require('cors');
const { getUsers } = require("./controller/user.controller.js")

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", fetchEndPoints);

app.get("/api/topics", fetchTopics);

app.get("/api/articles/:article_id", fetchArticlesByID);

app.get("/api/articles", fetchArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getUsers)






// 404 Error handler
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "404: Not Found" });
  next();
});

// 404 Error handler
app.use((err, req, res, next) => {
  if(err.code === '23503'){
    res.status(404).send({ msg: "404: Not Found" })
  } else {
    next(err)
  }
})

// 400 Error handler
app.use((err, req, res, next) => {
    if (err.code === "23502" || err.code === "22P02") {
      res.status(400).send({ msg: "400: Bad Request" });
    } else {
      next(err);
    }
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
