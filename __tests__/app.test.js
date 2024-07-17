const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("404 Requesting a path that does not exist.", () => {
  test("404: When path does not exist", () => {
    return request(app)
      .get("/api/incorrect-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("GET 200: Sends and array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((body) => {
        const topics = body._body.topics;
        expect(topics.length).toBe(3);
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic.slug).toEqual(expect.any(String));
          expect(topic.description).toEqual(expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  test("GET 200: Returns the information from the endpoints JSON file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200: Returns article with the specified article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        const article = body._body.article;

        const articleFormat = {
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        };

        expect(article).toMatchObject(articleFormat);
      });
  });
  test("GET 200: Returns article 1 data", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        const article = body._body.article;
        const articleFormat = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        };

        expect(article).toMatchObject(articleFormat);
      });
  });
  test("GET 404: Returns appropriate error message when provided with a valid but non-existent article ID", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article Found");
      });
  });
  test("GET 400: Returns correct error message if passed invalid article ID number", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(( body ) => {
        const message = body._body.msg
        expect(message).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((body) => {
        const articles = body._body.article;
        const articleFormat = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };
        articles.forEach((article) => {
          expect(article).toMatchObject(articleFormat);
          expect(articles.length).toBe(13);
        });
      });
  });
  test("GET 200: Returns articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((body) => {
        const articles = body._body.article;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Returns and array of comments with the specified article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((body) => {
        const comments = body._body.comments;
        const commentFormat = {
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: 1,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        };
        comments.forEach((comment) => {
          expect(comment).toMatchObject(commentFormat);
          expect(comments.length).toBe(11);
        });
      });
  });
  test("GET 200: Returns with an array of comments with a decending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((body) => {
        const comments = body._body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: Returns with an empty array if the article does not have any comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then((body) => {
        const comments = body._body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("GET 400: Returns correct error message if passed an invalid article id", () => {
    return request(app)
      .get("/api/articles/bananas/comments")
      .expect(400)
      .then(( body ) => {
        const message = body._body.msg
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 404: Returns correct error message if article id doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((body) => {
        const message = body._body.msg
        expect(message).toBe("Article Not Found");
      });
  });
});
