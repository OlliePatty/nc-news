const express = require('express')
const app = express()

const { getAllTopics } = require('./controllers/topics.controllers.js')
const { getArticlesById, getAllArticles } = require('./controllers/articles.controllers.js')
const { handlePsqlErrors , handleCustomErrors, handleServerErrors } = require('./errors/errors.js')

app.get('/api/topics', getAllTopics)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles', getAllArticles)

app.all('*', (_, response) => {
    response.status(404).send({status: 404, msg: 'Not found'})
})

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app