const db = require("../connection");

exports.selectArticlesById = (articleId) => {
  return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body,
    articles.created_at, articles.votes, articles.article_img_url, COUNT (comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [articleId]
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

exports.updateArticleVotes = (articleId, votes) => {
  if(!votes){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  return db.query(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`, [votes, articleId]).then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0]
  })
};

exports.insertArticles = ({author, title, body, topic, article_img_url}) => {
  if(!article_img_url){
    article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
  }
  
  if(!author || !title || !body || !topic){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }
  
  return db.query(`
  INSERT INTO articles
  (title, topic, author, body, article_img_url)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *;`, [title, topic, author, body, article_img_url]).then(({rows}) => {
    return rows[0]
  })
}

exports.deleteSelectArticles = (articleId) => {
  return db.query(`
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;`, [articleId]).then(({rows}) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}