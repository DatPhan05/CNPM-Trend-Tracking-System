import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scientific Journal Publication Trend Tracking API Docs",
      version: "1.0.0",
      description: "Tài liệu API hướng dẫn sử dụng Backend cho hệ thống theo dõi xu hướng tạp chí khoa học.",
      contact: {
        name: "Antigravity Team",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Development server",
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
  apis: ["./backend/routes/*.ts", "./backend/routes/*.js"], // Path to API route files containing Swagger JSDoc comments
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
