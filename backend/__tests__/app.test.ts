import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";

describe("App API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Scientific Journal Publication Trend Tracking System API is running");
  });
});