const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const app = require("../app.js");
const endpointsData = require("../endpoints.json");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api", () => {
  test("status:200, responds with the contents of endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsData);
      });
  });
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
          expect(article).toHaveProperty("comment_count", expect.any(String));
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
          comment_count: "2",
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
          comment_count: "11",
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
      randomSentence:
        "Let's continue to engage with these important narratives and work together towards a more informed and empathetic society.",
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

describe("PATCH /api/articles/:article_id", () => {
  test("status:200, should update the article votes property with how many new votes there are in the input body", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status:200, should update the article votes property with how many new votes there are in the input body when the votes is negative", () => {
    const votes = { inc_votes: -85 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 15,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status:400, when passed an input in the incorrect format should return error msg Bad request", () => {
    const votes = { inc_votes: "words" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed an empty input should return error msg Bad request", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:404, should return an error msg with Not found when the ID does not exist", () => {
    const votes = { inc_votes: 23 };
    return request(app)
      .patch("/api/articles/999999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, should return an error msg with Bad request when the ID is invalid", () => {
    const votes = { inc_votes: 23 };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204, when passed a comment ID should delete that comment and respond with no content", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("status:404, when passed a comment ID thats does not exist, should should return Error msg Not found", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, when passed a comment ID thats not valid, should should return Error msg Bad request", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

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

describe("GET /api/articles (queries)", () => {
  test("status:200, should return an articles array of article objects, filtered by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          },
        ]);
      });
  });
  test("status:404, when passed a topic that does not exist returns error msg Not Found", () => {
    return request(app)
      .get("/api/articles?topic=apples")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:200, should return an articles array of article objects, sorted by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("status:404, when passed a column that does not exist returns error msg Not Found", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:200, should return an articles array of article objects, ordered by ascending", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("status:200, should return an articles array of article objects, ordered by descending", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status:200, when topic, sort_by and order are omitted should respond with all articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("status:200, should return an article object, with the property, comment_count, which is the total count of all the comments with this article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
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
          comment_count: "11",
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

describe("GET /api/users/:username", () => {
  test("status:200, when passed a username, should return a user object with the correct properties", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });
  test("status:404, should return an error msg with Not found when the username does not exist", () => {
    return request(app)
      .get("/api/users/annonymousLurker")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status:200, should update the comment votes property with how many new votes there are in the input body", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("status:200, should update the comment votes property with how many new votes there are in the input body when the votes is negative", () => {
    const votes = { inc_votes: -7 };
    return request(app)
      .patch("/api/comments/2")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 2,
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 7,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("status:400, when passed an input in the incorrect format should return error msg Bad request", () => {
    const votes = { inc_votes: "words" };
    return request(app)
      .patch("/api/comments/3")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed an empty input should return error msg Bad request", () => {
    const votes = {};
    return request(app)
      .patch("/api/comments/4")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:404, should return an error msg with Not found when the ID does not exist", () => {
    const votes = { inc_votes: 23 };
    return request(app)
      .patch("/api/comments/999999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, should return an error msg with Bad request when the ID is invalid", () => {
    const votes = { inc_votes: 23 };
    return request(app)
      .patch("/api/comments/notAnId")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("status:201, should add a new article when passed a request body and return the new article back with the correct properties", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "Borat",
      body: "Ver nice",
      topic: "mitch",
      article_img_url:
        "https://m.media-amazon.com/images/M/MV5BMjA3MDA4NTUtYzY5YS00ZDlmLWI4ODUtODg4Y2Q1ZTkxMDVhXkEyXkFqcGdeQWFybm8@._V1_.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: "icellusedkars",
          title: "Borat",
          body: "Ver nice",
          article_id: 14,
          topic: "mitch",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://m.media-amazon.com/images/M/MV5BMjA3MDA4NTUtYzY5YS00ZDlmLWI4ODUtODg4Y2Q1ZTkxMDVhXkEyXkFqcGdeQWFybm8@._V1_.jpg",
          comment_count: 0,
        });
      });
  });
  test("status:201, should add a new article with the default article_img_url when not provided", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "Borat",
      body: "Ver nice",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: "icellusedkars",
          title: "Borat",
          body: "Ver nice",
          article_id: 14,
          topic: "mitch",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("status:400, when passed a body with properties missing should return error msg Bad request", () => {
    const newArticle = {
      body: "Ver nice",
      topic: "mitch",
      article_img_url:
        "https://m.media-amazon.com/images/M/MV5BMjA3MDA4NTUtYzY5YS00ZDlmLWI4ODUtODg4Y2Q1ZTkxMDVhXkEyXkFqcGdeQWFybm8@._V1_.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("status:201, should add a new topic when passed a request body, and return the new topic back", () => {
    const newTopic = {
      slug: "gym",
      description: "Gym is love, gym is life",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toEqual({
          slug: "gym",
          description: "Gym is love, gym is life",
        });
      });
  });
  test("status:400, when passed an empty slug should return error msg Bad request", () => {
    const newTopic = {
      slug: "",
      description: "Gym is love, gym is life",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed an empty description should return error msg Bad request", () => {
    const newTopic = {
      slug: "gym",
      description: "",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("status:400, when passed a topic without a slug or description property should ignore other properties and return error msg Bad request", () => {
    const newTopic = {
      randomSentence:
        "Let's continue to engage with these important narratives and work together towards a more informed and empathetic society.",
      xboxGamertag: "bobthebuilder",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("status:204, when passed an article ID should delete that article and respond with no content", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("status:404, when passed an article ID thats does not exist, should should return Error msg Not found", () => {
    return request(app)
      .delete("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status:400, when passed an article ID thats not valid, should should return Error msg Bad request", () => {
    return request(app)
      .delete("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
