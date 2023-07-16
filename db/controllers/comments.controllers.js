const { selectCommentsByArticleId, insertComments, deleteSelectComments, updateCommentVotes } = require('../models/comments.models')

exports.getCommentsByArticleId = (request, response, next) => {
    const articleId = request.params.article_id
    selectCommentsByArticleId(articleId).then((comments) => {
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
    const commentId = request.params.comment_id
    deleteSelectComments(commentId).then(() => {
        response.status(204).send()
    })
    .catch(next)
}

exports.patchCommentVotes = (request, response, next) => {
    const commentId = request.params.comment_id
    const votes = request.body.inc_votes
    updateCommentVotes(commentId, votes).then((comment)=>{
        response.status(200).send({comment})
    })
    .catch(next)
}