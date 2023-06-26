const { selectAllTopics } = require('../models/topics.models.js') 

exports.getAllTopics = (request, response, next) => {
    selectAllTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
}