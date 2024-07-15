const db = require('../connection')

exports.getTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}
