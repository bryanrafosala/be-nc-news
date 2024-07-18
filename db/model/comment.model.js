const db = require("../connection")

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`
    const queryValues = [article_id]

    return db.query(queryStr, queryValues).then(({rows}) => {
        return rows
    })
}

exports.addComment = (newComment, article_id) => {
  const { body, username } = newComment;

  const queryStr = `INSERT INTO comments (body, article_id, author)
        VALUES ($1, $2, $3) RETURNING *;`;
  const queryValues = [body, article_id, username];

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (!rows.length) {
        return Promise.reject({ status:404, msg: "404: Not Found"})
    } else {
        return rows[0];
    }

  });
};

exports.deleteComment = (comment_id) =>{
    return db
      .query(
        `DELETE FROM comments WHERE comment_id=$1
      RETURNING *;`,
        [comment_id]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "404: Not Found" });
        }
      });
  };
  
