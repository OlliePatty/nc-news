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

exports.selectAllArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
  let queryString = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,
    articles.votes, articles.article_img_url, COUNT (comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id `
    const queryValues = []

    if (topic){
      queryString += `WHERE articles.topic = $1 `
      queryValues.push(topic)
    }
    if(sort_by){
      queryString += `GROUP BY articles.article_id
      ORDER BY ${sort_by} `
    }

    if(order){
      queryString += `${order}`
    }

    return db.query(queryString, queryValues).then(({rows}) => {
      if(!rows.length){
        return Promise.reject({status: 404, msg: 'Not found'})
      } else{
      return rows
      }
    })
};

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
};