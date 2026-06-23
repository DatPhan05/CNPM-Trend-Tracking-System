import request from "supertest";
import app from "../app";
import prisma from "../helpers/prisma";

// Mock prisma
jest.mock("../helpers/prisma", () => ({
  paper: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  author: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  keyword: {
    count: jest.fn(),
  },
  journal: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("Analytics API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/analytics/overview", () => {
    it("should return correct overview data", async () => {
      (prisma.paper.count as jest.Mock).mockResolvedValueOnce(100); // totalPapers
      (prisma.author.count as jest.Mock).mockResolvedValueOnce(50); // totalAuthors
      (prisma.keyword.count as jest.Mock).mockResolvedValueOnce(30); // totalKeywords
      (prisma.journal.count as jest.Mock).mockResolvedValueOnce(10); // totalJournals
      (prisma.paper.count as jest.Mock).mockResolvedValueOnce(5);   // newPapersThisMonth

      const res = await request(app).get("/api/analytics/overview");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalPapers).toBe(100);
      expect(res.body.data.totalAuthors).toBe(50);
      expect(res.body.data.totalKeywords).toBe(30);
      expect(res.body.data.totalJournals).toBe(10);
      expect(res.body.data.newPapersThisMonth).toBe(5);
    });

    it("should handle errors", async () => {
      (prisma.paper.count as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));

      const res = await request(app).get("/api/analytics/overview");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/analytics/trends", () => {
    it("should return trends data", async () => {
      (prisma.paper.groupBy as jest.Mock).mockResolvedValueOnce([
        { publicationYear: 2020, _count: { id: 10 } },
        { publicationYear: 2021, _count: { id: 20 } },
      ]);

      const res = await request(app).get("/api/analytics/trends");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([
        { year: "2020", count: 10 },
        { year: "2021", count: 20 },
      ]);
    });
  });

  describe("GET /api/analytics/categories", () => {
    it("should return categories data", async () => {
      (prisma.journal.findMany as jest.Mock).mockResolvedValueOnce([
        { name: "Journal A", _count: { papers: 15 } },
        { name: "Journal B", _count: { papers: 8 } },
      ]);

      const res = await request(app).get("/api/analytics/categories");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([
        { name: "Journal A", value: 15 },
        { name: "Journal B", value: 8 },
      ]);
    });
  });

  describe("GET /api/analytics/top-authors", () => {
    it("should return top authors data", async () => {
      (prisma.author.findMany as jest.Mock).mockResolvedValueOnce([
        { name: "Author X", _count: { papers: 12 } },
        { name: "Author Y", _count: { papers: 7 } },
      ]);

      const res = await request(app).get("/api/analytics/top-authors");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([
        { name: "Author X", count: 12 },
        { name: "Author Y", count: 7 },
      ]);
    });
  });
});
