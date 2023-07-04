const { selectArticlesById, selectAllArticles, selectCommentsByArticleId, insertComments, updateArticleVotes } = require('../models/articles.models.js')

exports.getArticlesById = (request, response, next) => {
    const id = request.params.article_id
    selectArticlesById(id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (request, response, next) => {
    const { topic, sort_by, order } = request.query
    selectAllArticles(topic, sort_by, order).then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)
}

exports.patchArticleVotes = (request, response, next) => {
    const votes = request.body.inc_votes
    const id = request.params.article_id
    updateArticleVotes(votes, id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}