import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";

jest.mock("../lib/prisma");

describe("🧪 API Integration & Endpoint Unit Tests", () => {
  let token: string;
  let testPaperId: string;
  const testEmail = `testuser_${Date.now()}@gmail.com`;

  // Before all tests, fetch a real paper ID from the seeded database to use in bookmark tests
  beforeAll(async () => {
    const paper = await prisma.paper.findFirst();
    if (paper) {
      testPaperId = paper.id;
    } else {
      // Create a dummy paper if database is completely empty
      const journal = await prisma.journal.upsert({
        where: { name: "Nature Test" },
        update: {},
        create: { name: "Nature Test" },
      });
      const newPaper = await prisma.paper.create({
        data: {
          title: "Test Paper For Unit Tests",
          abstract: "Abstract summary for testing.",
          publicationYear: 2026,
          journalId: journal.id,
        },
      });
      testPaperId = newPaper.id;
    }
  });

  // Clean up test data after tests finish
  afterAll(async () => {
    // Clean up our test user
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });
    await prisma.$disconnect();
  });

  describe("🔑 Authentication Endpoints", () => {
    it("should successfully register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test Developer",
          email: testEmail,
          password: "password123",
          role: "RESEARCHER",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it("should fail to register a user with an existing email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Duplicate User",
          email: testEmail,
          password: "password123",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should successfully log in and return a JWT Token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testEmail,
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      token = res.body.data.token; // Save JWT token for authenticated tests below
    });
  });

  describe("📄 Papers & Trends Endpoints", () => {
    it("should fetch list of scientific papers", async () => {
      const res = await request(app).get("/api/papers");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.papers)).toBe(true);
    });

    it("should filter papers by title search query", async () => {
      const res = await request(app).get("/api/papers?query=Test");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should successfully fetch trends statistics metrics", async () => {
      const res = await request(app).get("/api/trends");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalPapers).toBeDefined();
      expect(res.body.stats.totalCitations).toBeDefined();
      expect(Array.isArray(res.body.stats.topKeywords)).toBe(true);
    });
  });

  describe("📌 Bookmarks Endpoints", () => {
    it("should deny access to bookmarks fetch without a JWT token", async () => {
      const res = await request(app).get("/api/bookmarks");
      expect(res.status).toBe(401);
    });

    it("should successfully add a paper to bookmark list", async () => {
      const res = await request(app)
        .post("/api/bookmarks")
        .set("Authorization", `Bearer ${token}`)
        .send({ paperId: testPaperId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should successfully fetch bookmarked papers for current user", async () => {
      const res = await request(app)
        .get("/api/bookmarks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.papers.some((p: any) => p.id === testPaperId)).toBe(true);
    });

    it("should successfully remove paper from bookmarks list", async () => {
      // RESTful: DELETE /api/bookmarks/:paperId (was POST /api/bookmarks/remove)
      const res = await request(app)
        .delete(`/api/bookmarks/${testPaperId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("🔄 Refresh Token Endpoint", () => {
    it("should return a new access_token given a valid refresh_token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refresh_token: token });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.refresh_token).toBeDefined();
    });

    it("should return 400 when refresh_token is missing", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 when refresh_token is invalid/tampered", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refresh_token: "this.is.not.a.valid.jwt" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
