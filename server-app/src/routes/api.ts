import { FastifyInstance } from 'fastify';
import { AuthRoutes } from '@/modules/auth';
import { CommandRoutes } from '@/modules/commands';
import { ProductRoutes } from '@/modules/product';
import { UserRoute } from '@/modules/users';

const api = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    return { message: 'Hello user, what are you trying to do?' };
  });

  AuthRoutes.Routes(fastify);
  CommandRoutes.Routes(fastify);
  ProductRoutes.Routes(fastify);
  UserRoute.Routes(fastify);
};

export default api;