const { checkIfArticleIdExists } = require("../model/article.model");
const {
  selectCommentsByArticleId,
  addComment,
  deleteComment,
} = require("../model/comment.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [selectCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(checkIfArticleIdExists(article_id));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  addComment(newComment, article_id)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
