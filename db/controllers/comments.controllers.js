const { selectCommentsByArticleId, insertComments, deleteSelectComments } = require('../models/comments.models')

exports.getCommentsByArticleId = (request, response, next) => {
    const id = request.params.article_id
    selectCommentsByArticleId(id).then((comments) => {
        response.status(200).send({comments})
    })
    .catch(next)
}

exports.postComments = (request, response, next) => {
    const articleId = request.params.article_id
    const newComment = request.body
    insertComments(articleId, newComment).then((comment) => {
        response.status(201).send({comment})
    })
    .catch(next)
}

exports.deleteComments = (request, response, next) => {
    const id = request.params.comment_id
    deleteSelectComments(id).then(() => {
        response.status(204).send()
    })
    .catch(next)
}