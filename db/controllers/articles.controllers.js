const { selectArticlesById, selectAllArticles, selectCommentsFromArticleId, insertComments, updateArticleVotes } = require('../models/articles.models.js')

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

exports.getCommentsFromArticleId = (request, response, next) => {
    const id = request.params.article_id
    selectCommentsFromArticleId(id).then((comments) => {
        response.status(200).send({comments})
    })
    .catch(next)
}

exports.postComments = (request, response, next) => {
    const articleId = request.params.article_id
    const newComment = (request.body)
    insertComments(articleId, newComment).then((comment) => {
        response.status(201).send({comment})
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