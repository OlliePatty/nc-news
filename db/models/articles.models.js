const db = require("../connection");

exports.selectArticlesById = (id) => {
  return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectAllArticles = () => {
  return db.query(`
    SELECT 
    author, title, article_id, topic, created_at, votes, article_img_url
    FROM articles
    ORDER BY created_at DESC;`
    )
    .then((articlesData) => {
      const articles = articlesData.rows;
      return articles;
    })
    .then((articles) => {
      return db.query(`SELECT * FROM comments;`)
        .then((commentsData) => {
          const comments = commentsData.rows;
          return comments;
        })
    .then((comments) => {
          articles.forEach((article) => {
            article.comment_count = 0;
            comments.forEach((comment) => {
              if (article.article_id === comment.article_id) {
                article.comment_count++;
              }
            });
          });
          return articles;
        });
    });
};

exports.selectCommentsFromArticleId = (id) => {
  return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

exports.insertComments = (articleId, {body, username}) => {
    if (!body || !username){
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    return db.query(`
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`, [body, username, articleId]).then(({rows}) => {
        return rows[0]
    })
}

exports.updateArticleVotes = (votes, id) => {
  if(!votes){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  return db.query(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`, [votes, id]).then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0]
  })
}