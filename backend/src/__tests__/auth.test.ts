import request from "supertest";
import app from "../app";
import prisma from "../helpers/prisma";

describe("Auth API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("POST /api/auth/login should require email and password", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("POST /api/auth/register should require fullName, email and password", async () => {
    const response = await request(app).post("/api/auth/register").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
});