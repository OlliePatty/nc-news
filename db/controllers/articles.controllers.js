const { selectArticlesById, selectAllArticles } = require('../models/articles.models.js')

exports.getArticlesById = (request, response, next) => {
    const id = request.params.article_id
    selectArticlesById(id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (request, response, next) => {
    selectAllArticles().then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)
}
