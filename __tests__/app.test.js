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




describe("/api/topics", () => {
  test("GET 200: sends and array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((body) => {
        const topics = body._body.topics;
        expect(topics.length).toBe(3);
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe('/api', () => {
  test('GET 200: Returns the information from the endpoints JSON file', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
          expect(body.endpoints).toEqual(endpoints)
      })
  });
});

