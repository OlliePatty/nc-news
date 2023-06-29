
exports.handlePsqlErrors = (error, request, response, next) => {
    if(error.code === '22P02'){
        response.status(400).send({ msg: 'Bad request' })
    } else
    if(error.code === '23503'){
        response.status(404).send({ msg: 'Not found' })
    }  else next(error)
}

exports.handleCustomErrors = (error, request, response, next) => {
    if(error.msg){
        response.status(error.status).send({ msg: error.msg })
    } else next(error)
}

exports.handleServerErrors = (error, request, response, next) => {
    console.log('Unhandled', error)
    response.status(500).send({ msg: 'Server Error!' })
}