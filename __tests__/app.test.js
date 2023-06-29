const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')
const db = require('../db/connection.js')
const app = require('../db/app.js')
const jestSorted = require('jest-sorted')
const comments = require('../db/data/test-data/comments.js')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    if(db.end) db.end()
})

describe('GET /api/topics', () =>{
    test('status:200, should return an array of topic objects, with slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const { topics } = body
                expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug', expect.any(String))
                expect(topic).toHaveProperty('description', expect.any(String))
            })
        })
    })
    test('status:404, should return an error msg Not found when passed a route that does not exist', () => {
        return request(app)
        .get('/api/notARoute')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

describe('GET /api/articles/:article_id', () =>{
    test('status:200, should return an article object, with correct properties when the endpoint is a valid article ID number', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const { article } = body
                expect(article.article_id).toBe(1)
                expect(article).toMatchObject({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                  })
        })
    })
    test('status:404, should return an error msg with Not found when the ID does not exist', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test('status:400, should return an error msg with Bad request when the ID is not valid', () => {
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('GET /api/articles', () => {
    test('status:200, should return an articles array of article objects, each of which should have the correct properties', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.any(String))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('comment_count', expect.any(Number))
            })
        })
    })
    test('status:200, should return an articles array of article objects, ordered by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('status:200, should return an articles array of article objects, with correct comment_count value ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles[0]).toMatchObject({
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 2
              })
              expect(articles[6]).toMatchObject({
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                article_id: 1,
                topic: 'mitch',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 11
              })
        })
    })
    test('status:404, should return an error msg Not found when passed a route that does not exist', () => {
        return request(app)
        .get('/api/notARoute')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('status:200, should return an array of comments for the given article_id of which each comment should have the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment.article_id).toBe(1)
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('article_id', expect.any(Number))
            })
        })
    })
    test('status:200, should return an array of comments for the given article_id, ordered by date in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('status:404, should return an error msg with Not found when the ID does not exist', () => {
        return request(app)
        .get('/api/articles/999999/comments')
        .expect(404)
        .then(({body}) => {
         expect(body.msg).toBe('Not found')
        })
    })
    test('status:400, should return an error msg with Bad request when the ID is not valid', () => {
        return request(app)
        .get('/api/articles/notAnId/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})




// describe('PATCH /api/articles/:article_id', () => {
//   test('status:, ', () => {
//     return request(app)
//     .patch('/api/articles/7')
//     .send()
//     .expect(200)
//     .then(({body}) => {
//       expect()
//     })
//   })
// })

describe('GET /api/users', () => {
    test('status:200, should return an array of user objects, with username, name and avatar_url properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const { users } = body
                expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
            })
        })
    })
    test('status:404, should return an error msg Not found when passed a route that does not exist', () => {
        return request(app)
        .get('/api/notARoute')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

