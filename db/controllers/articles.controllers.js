const { selectArticlesById, selectAllArticles, updateArticleVotes, insertArticles, deleteSelectArticles } = require('../models/articles.models.js')

exports.getArticlesById = (request, response, next) => {
    const articleId = request.params.article_id
    selectArticlesById(articleId).then((article) => {
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
    const articleId = request.params.article_id
    const votes = request.body.inc_votes
    updateArticleVotes(articleId, votes).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}

exports.postArticles = (request, response, next) => {
    const newArticle = request.body
    insertArticles(newArticle).then((article) => {
        response.status(201).send({article})
    })
    .catch(next)
}

exports.deleteArticles = (request, response, next) => {
    const articleId = request.params.article_id
    deleteSelectArticles(articleId).then(() => {
        response.status(204).send()
    })
    .catch(next)
}