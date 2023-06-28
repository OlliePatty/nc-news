const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')
const db = require('../db/connection.js')
const app = require('../db/app.js')
const jestSorted = require('jest-sorted')

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
        .get('/api/articles/99999999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test('status:400, should return an error msg with Bad request when the ID is not valid', () => {
        return request(app)
        .get('/api/articles/notAValidId')
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
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('comment_count')
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

// describe('POST /api/articles/:article_id/comments', () => {
//     test('status:201, should add a comment for an article when passed and article ID', () => {
//         const newComment =   {
//             body: "An insightful article shedding light on the latest breakthrough in renewable energy technology!",
//             author: "butter_bridge"
//           }
//         return request(app)
//         .post('/api/articles/9/comments')
//         .send(newComment)
//         .expect(201)
//         .then(({body}) => {
//             const { comment } = body
//             expect(comment).toMatchObject({

//             })
//         })
//     })
// })