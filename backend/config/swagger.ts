import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trend-Tracking-System API",
      version: "1.0.0",
      description:
        "API documentation for Trend-Tracking-System",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./backend/routes/*.ts", "./dist/backend/routes/*.js"],
});