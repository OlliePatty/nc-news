const express = require('express')
const app = express()

const { getAllTopics } = require('./controllers/topics.controllers.js')

app.get('/api/topics', getAllTopics)

app.use((error, request, response, next) => {
    response.status(500).send('Server Error!');
  })

module.exports = app