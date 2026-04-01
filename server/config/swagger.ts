import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API Documentation by Hitanshu Gala for Zorvyn Backend Intern Assessment",
      version: "1.0.0",
      description: "API documentation for the Finance Dashboard Backend services.",
    },
    servers: [
      {
        url: "http://localhost:5555",
        description: "Development/Local Server",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Look for swagger JSDoc headers in routes and controllers
  apis: ["./routes/*.ts", "./controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
