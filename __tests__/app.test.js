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
        //Arrange
        return request(app)
        //Act
        .get('/api/topics')
        //Assert
        .expect(200)
        .then(({body}) => {
            const { topics } = body
                expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
})