const app = require('./db/connection')

const { PORT = 9090 } = process.env

app.listenerCount(PORT, () => {
    console.log(`app is listening on ${PORT}`)
})