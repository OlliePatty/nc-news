const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')
const db = require('../db/connection.js')
const app = require('../db/app.js')

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
                expect(topics.length).toBe(3)
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