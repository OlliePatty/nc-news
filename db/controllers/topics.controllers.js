const { selectAllTopics, insertTopics } = require('../models/topics.models.js') 

exports.getAllTopics = (request, response, next) => {
    selectAllTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
}

exports.postTopics = (request, response, next) => {
    const newTopic = request.body
    insertTopics(newTopic).then((topic) => {
        response.status(201).send({topic})
    })
    .catch(next)
}