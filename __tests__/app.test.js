const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const app = require("../db/app.js");
const jestSorted = require("jest-sorted");
const comments = require("../db/data/test-data/comments.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/topics", () => {
  test("status:200, should return an array of topic objects, with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("status:404, should return an error msg Not found when passed a route that does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, should return an article object, with correct properties when the endpoint is a valid article ID number", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status:404, should return an error msg with Not found when the ID does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, should return an error msg with Bad request when the ID is not valid", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200, should return an articles array of article objects, each of which should have the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("status:200, should return an articles array of article objects, ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status:200, should return an articles array of article objects, with correct comment_count value", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0]).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
        expect(articles[6]).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });
  test("status:404, should return an error msg Not found when passed a route that does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, should return an array of comments for the given article_id of which each comment should have the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("status:200, should return an array of comments for the given article_id, ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status:404, should return an error msg with Not found when the ID does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, should return an error msg with Bad request when the ID is not valid", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, should add a comment for an article when passed an article ID. Should pass the correct comment ID when passed a subsequent comment.", () => {
    const newComment1 = {
      body: "An insightful article shedding light on the latest breakthrough in renewable energy technology!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment1)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "An insightful article shedding light on the latest breakthrough in renewable energy technology!",
          article_id: 4,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
        const newComment2 = {
          body: "This news undoubtedly opens up new possibilities and promises exciting advancements in the future.",
          username: "icellusedkars",
        };
        return request(app)
          .post("/api/articles/6/comments")
          .send(newComment2)
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toMatchObject({
              comment_id: 20,
              body: "This news undoubtedly opens up new possibilities and promises exciting advancements in the future.",
              article_id: 6,
              author: "icellusedkars",
              votes: 0,
              created_at: expect.any(String),
            });
          });
      });
  });
  test("status:400, when passed an empty body should return error msg Bad request", () => {
    const newComment = {
      body: "",
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed an empty username should return error msg Bad request", () => {
    const newComment = {
      body: "This news undoubtedly opens up new possibilities and promises exciting advancements in the future.",
      username: "",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed a comment without a body or username property should ignore other properties and return error msg Bad request", () => {
    const newComment = {
      randomSentence: "Let's continue to engage with these important narratives and work together towards a more informed and empathetic society.",
      xboxGamertag: "bobthebuilder",
    };
    return request(app)
      .post("/api/articles/8/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:404, when passed an invalid username should return error msg Not found", () => {
    const newComment = {
      body: "Let's continue to engage with these important narratives and work together towards a more informed and empathetic society.",
      username: "bobthebuilder",
    };
    return request(app)
      .post("/api/articles/8/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:404, should return an error msg with Not found when the ID does not exist", () => {
    const newComment = {
        body: "This article provides valuable insights into the latest developments, offering a well-rounded perspective on the events shaping our present.",
        username: "icellusedkars",
      };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, should return an error msg with Bad request when the ID is invalid", () => {
    const newComment = {
        body: "This article provides valuable insights into the latest developments, offering a well-rounded perspective on the events shaping our present.",
        username: "icellusedkars",
      };
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('status:200, should update the article votes property with how many new votes there are in the input body', () => {
    const votes = { inc_votes : 1 }
    return request(app)
    .patch('/api/articles/1')
    .send(votes)
    .expect(200)
    .then(({body}) => {
      const { article } = body
      expect(article).toMatchObject({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: expect.any(String),
        votes: 101,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      })
    })
  })
  test('status:200, should update the article votes property with how many new votes there are in the input body when the votes is negative', () => {
    const votes = { inc_votes : -85 }
    return request(app)
    .patch('/api/articles/1')
    .send(votes)
    .expect(200)
    .then(({body}) => {
      const { article } = body
      expect(article).toMatchObject({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: expect.any(String),
        votes: 15,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      })
    })
  })
  test('status:400, when passed an input in the incorrect format should return error msg Bad request', () => {
    const votes = { inc_votes : 'words' }
    return request(app)
    .patch('/api/articles/1')
    .send(votes)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Bad request')
    })
  })
  test('status:400, when passed an empty input should return error msg Bad request', () => {
    const votes = {}
    return request(app)
    .patch('/api/articles/1')
    .send(votes)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Bad request')
    })
  })
  test('status:404, should return an error msg with Not found when the ID does not exist', () => {
    const votes = { inc_votes : 23 }
    return request(app)
    .patch('/api/articles/999999')
    .send(votes)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Not found')
    })
  })
  test('status:400, should return an error msg with Bad request when the ID is invalid', () => {
    const votes = { inc_votes : 23 }
    return request(app)
    .patch('/api/articles/notAnId')
    .send(votes)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Bad request')
    })
  })
})

describe("GET /api/users", () => {
  test("status:200, should return an array of user objects, with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
  test("status:404, should return an error msg Not found when passed a route that does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
