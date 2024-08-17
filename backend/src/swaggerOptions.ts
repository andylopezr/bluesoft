import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bluesoft Bank API",
      version: "1.0.0",
      description: "API documentation for the Bluesoft Bank project",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
