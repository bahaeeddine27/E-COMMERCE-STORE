import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API DIGIT-SELL",
      version: "1.0.0",
      description: "Documentation de l'API pour le site e-commerce DIGIT-SELL",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./backend/routes/*.js"], // Inclure tous les fichiers de routes
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;