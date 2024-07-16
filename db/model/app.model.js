const db = require("../connection");

exports.getTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.getArticlesById = (article_id) => {
  let queryStr = `SELECT
      articles.*,
     CAST(COUNT(comments.body) AS INT) AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      HAVING articles.article_id = $1`;

  const queryValues = [article_id];

  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No Article Found" });
    } else {
      return result.rows[0];
    }
  });
};
