const db = require("../connection");

exports.selectUsers = () => {
    const queryStr = `SELECT * FROM users;`;
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
  };