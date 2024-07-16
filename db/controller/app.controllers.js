const endpoints = require("../../endpoints.json");
const db = require("../connection");
const { getTopics, getArticlesById } = require("../model/app.model");

exports.fetchEndPoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.fetchTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  return getArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
