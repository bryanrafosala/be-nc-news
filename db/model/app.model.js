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
exports.getArticles = (topic, sortby = "created_at", order = "desc") => {
  const validSortBy = ["created_at", "comment_count", "votes"];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sortby) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryString = `
    SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author,
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.article_id) :: INT AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id`;

  const queryValues = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.article_id`;

  if (sortby) {
    queryString += ` ORDER BY ${sortby} ${order}`;
  } else {
    queryString += ` ORDER BY articles.${sortby} ${order}`;
  }

  return db.query(queryString, queryValues)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    });
};

exports.ifQueryExist = (topic) => {
  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE slug=$1`, [topic])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 400, msg: "400: Bad Request" });
        }
      });
  }
};

exports.checkIfArticleIdExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
		SET votes = votes + $1
		WHERE article_id=$2
		RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
