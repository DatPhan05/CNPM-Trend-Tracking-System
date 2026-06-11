import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";

describe("RBAC API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("GET /api/users should require access token", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token is required");
  });

  it("GET /api/settings should require access token", async () => {
    const response = await request(app).get("/api/settings");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token is required");
  });
});