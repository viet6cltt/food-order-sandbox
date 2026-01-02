const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodOrder API',
      version: '1.0.0',
      description: 'API documentation for FoodOrder project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
      {
        url: 'https://api.foodorder.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../controllers/admin/*.js'),
    path.join(__dirname, '../controllers/app/*.js'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, '../routes/admin/*.js'),
    path.join(__dirname, '../routes/app/*.js'),
    path.join(__dirname, '../routes/*.js'),
  ],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
    },
  }));
}

module.exports = setupSwagger;
