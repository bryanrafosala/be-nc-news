const endpoints = require("../../endpoints.json");
const db = require("../connection");
const {
  getTopics,
  getArticlesById,
  getArticles,
  updateVotes,
} = require("../model/app.model");

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

exports.fetchArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.params;
  getArticles(topic, sort_by, order)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
