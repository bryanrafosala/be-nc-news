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
  test("GET 200: sends and array of topics", () => {
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

describe('GET /api', () => {
  test('GET 200: Returns the information from the endpoints JSON file', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
          expect(body.endpoints).toEqual(endpoints)
      })
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200: returns article with the specified article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((body) => {
        const article = body._body.article

        const articleFormat = 
        {
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        }

       expect(article).toMatchObject(articleFormat)
      });
  });
  test("GET 404: returns appropriate error message when provided with a valid but non-existent article ID", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article Found");
      });
  });
  test("GET 400: returns correct error message if passed invalid article ID number", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
})
