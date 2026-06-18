import swaggerJsdoc from 'swagger-jsdoc';
import { baseSwaggerDef } from '@egov/shared';

const options: swaggerJsdoc.Options = {
  definition: {
    ...baseSwaggerDef,
    info: {
      title: 'Complaint Service API',
      version: '1.0.0',
      description: 'API docs for the eGOV Complaint Service',
    },
    servers: [{ url: '/api/v1' }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
