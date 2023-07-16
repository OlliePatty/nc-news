const db = require("../connection");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
      SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

exports.insertComments = (articleId, { body, username }) => {
  if (!body || !username) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
      [body, username, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteSelectComments = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
      [commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

exports.updateCommentVotes = (commentId, votes) => {
  if(!votes){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  return db.query(`
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`, [votes, commentId]).then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0]
  })
}