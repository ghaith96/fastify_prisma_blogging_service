import Fastify, { FastifyInstance } from 'fastify';
import { PrismaPlugin, AuthPlugin } from './Plugins';
import { UserRouter } from './User';
import { PostsRouter } from './Posts';

const server: FastifyInstance = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      $data: true,
    }
  }
});

server.register(PrismaPlugin);
server.register(AuthPlugin);
server.register(UserRouter);
server.register(PostsRouter, { prefix: '/posts' });

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    process.exit(1);
  }
});
