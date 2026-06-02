import request from "supertest";
import app from "../app";

describe("App API", () => {
  it("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("TrendScholar API is running");
  });
});