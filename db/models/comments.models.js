const db = require('../connection')

exports.deleteSelectComments = (id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`, [id]).then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows
    })
}