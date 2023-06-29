const { deleteSelectComments } = require('../models/comments.models')

exports.deleteComments = (request, response, next) => {
    const id = request.params.comment_id
    deleteSelectComments(id).then(() => {
        response.status(204).send()
    })
    .catch(next)
}