const express = require('express')
const app = express()
app.use(express.json())
const endpointsData = require('./endpoints.json')
const { getAllTopics } = require('./db/controllers/topics.controllers.js')
const { getArticlesById, getAllArticles, getCommentsFromArticleId, postComments, patchArticleVotes } = require('./db/controllers/articles.controllers.js')
const { deleteComments } = require('./db/controllers/comments.controllers.js')
const { getAllUsers } = require('./db/controllers/users.controllers.js')
const { handlePsqlErrors , handleCustomErrors, handleServerErrors } = require('./db/errors/errors.js')

app.get('/api', (request, response) => {
    response.status(200).send(endpointsData)
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsFromArticleId)

app.post('/api/articles/:article_id/comments', postComments)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteComments)

app.get('/api/users', getAllUsers)

app.all('*', (_, response) => {
    response.status(404).send({status: 404, msg: 'Not found'})
})

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app