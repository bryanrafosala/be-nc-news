const db = require("../connection")

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`
    const queryValues = [article_id]

    return db.query(queryStr, queryValues).then(({rows}) => {
        return rows
    })
}
