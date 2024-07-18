  const endpoints = require("../../endpoints.json");
const db = require("../connection");
const { sort } = require("../data/test-data/articles");
const {
  getTopics,
  getArticlesById,
  getArticles,
  updateVotes,
  ifQueryExist,
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

exports.fetchArticles = (req, res, next)  => {
  const { topic } = req.query
  Promise.all([getArticles(topic), ifQueryExist(topic)])
    .then(([articles]) => {
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

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
