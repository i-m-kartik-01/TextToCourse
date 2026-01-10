const request = require("supertest");
const app = require("../index");

describe("Health API", () => {
  it("returns 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });
});
