const { response } = require('../app')
const { selectAllUsers } = require('../models/users.models')

exports.getAllUsers = (request, response, next) => {
    selectAllUsers().then((users) => {
        response.status(200).send({users})
    })
    .catch(next)
}