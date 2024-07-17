const { checkIfArticleIdExists } = require("../model/app.model");
const { selectCommentsByArticleId } = require("../model/comment.model");

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
