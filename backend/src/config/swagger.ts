import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Scientific Journal Publication Trend Tracking System API",
      version: "1.0.0",
      description:
        "OpenAPI documentation for authentication, papers, bookmarks, user administration, crawler, analytics, and report export APIs.",
      contact: {
        name: "CNPM Development Team",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Local development API server",
      },
    ],
    tags: [
      { name: "Health", description: "Service status and database connectivity" },
      { name: "Auth", description: "Register, login, profile, password, and token APIs" },
      { name: "Papers", description: "Search, filter, and inspect scientific papers" },
      { name: "Bookmarks", description: "Manage saved papers for authenticated users" },
      { name: "Users", description: "Admin user management APIs" },
      { name: "Settings", description: "System configuration APIs" },
      { name: "Crawler", description: "Collect paper data from OpenAlex" },
      { name: "Analytics", description: "Statistics, charts, and report export APIs" },
      { name: "Admin", description: "Admin dashboard helper APIs" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Internal server error" },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation completed successfully" },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            database: { type: "string", example: "connected" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "user-001" },
            fullName: { type: "string", example: "Admin User" },
            name: { type: "string", example: "Admin User" },
            email: { type: "string", format: "email", example: "admin@example.com" },
            role: { type: "string", enum: ["ADMIN", "STUDENT", "RESEARCHER"], example: "ADMIN" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", example: "Student User" },
            email: { type: "string", format: "email", example: "student@example.com" },
            password: { type: "string", minLength: 6, example: "admin123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@admin.com" },
            password: { type: "string", example: "admin123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successfully" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Paper: {
          type: "object",
          properties: {
            id: { type: "string", example: "paper-001" },
            title: { type: "string", example: "Attention Is All You Need" },
            authors: {
              type: "array",
              items: { type: "string" },
              example: ["Ashish Vaswani", "Noam Shazeer"],
            },
            year: { type: "integer", example: 2017 },
            journal: { type: "string", example: "NIPS" },
            citations: { type: "integer", example: 4500 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["Machine Learning", "Large Language Models"],
            },
            abstract: { type: "string", example: "This paper introduces the Transformer architecture." },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            total: { type: "integer", example: 120 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            totalPages: { type: "integer", example: 12 },
          },
        },
        PaperListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Get papers successfully" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Paper" },
            },
            meta: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        PaperDetailResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Get paper successfully" },
            paper: { $ref: "#/components/schemas/Paper" },
          },
        },
        BookmarkListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            papers: {
              type: "array",
              items: { $ref: "#/components/schemas/Paper" },
            },
          },
        },
        OverviewMetrics: {
          type: "object",
          properties: {
            totalPapers: { type: "integer", example: 128 },
            totalAuthors: { type: "integer", example: 64 },
            totalKeywords: { type: "integer", example: 32 },
            totalJournals: { type: "integer", example: 12 },
            newPapersThisMonth: { type: "integer", example: 8 },
          },
        },
        AnalyticsOverviewResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/OverviewMetrics" },
          },
        },
        TrendPoint: {
          type: "object",
          properties: {
            year: { type: "string", example: "2026" },
            count: { type: "integer", example: 24 },
          },
        },
        CategoryPoint: {
          type: "object",
          properties: {
            name: { type: "string", example: "Nature Machine Intelligence" },
            value: { type: "integer", example: 18 },
          },
        },
        TopAuthorPoint: {
          type: "object",
          properties: {
            name: { type: "string", example: "Jane Smith" },
            count: { type: "integer", example: 7 },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing, invalid, or expired",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ForbiddenError: {
          description: "Authenticated user does not have permission",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ValidationError: {
          description: "Invalid request payload or query parameters",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  apis: [
    "./backend/src/app.ts",
    "./backend/src/routes/auth.routes.ts",
    "./backend/src/routes/admin.routes.ts",
    "./backend/src/routes/user.routes.ts",
    "./backend/src/routes/setting.routes.ts",
    "./backend/src/routes/crawler.routes.ts",
    "./backend/src/routes/paper.routes.ts",
    "./backend/src/routes/bookmark.routes.ts",
    "./backend/src/routes/analytics.routes.ts",
  ],
});

export { swaggerSpec };
export default swaggerSpec;
