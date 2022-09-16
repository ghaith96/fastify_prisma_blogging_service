import { FastifyPluginAsync } from "fastify";
import {
    createPostCommentHandler,
    createPostCommentSchema,
    createPostHandler,
    createPostSchema,
    getPostByIdHandler,
    getPostByIdSchema,
    getPostsHandler,
    getPostsHandlerSchema,
    publishPostHandler,
    publishPostSchema
} from "./routes";

const PostsRouter: FastifyPluginAsync = async (fastify, opts) => {
    fastify.route({
        method: 'GET',
        url: '/',
        onRequest: fastify.authenticate({ allowAnonymous: true }),
        handler: getPostsHandler,
        schema: getPostsHandlerSchema,
    });

    fastify.route({
        method: 'PATCH',
        url: '/:postId/publish',
        onRequest: fastify.authenticate(),
        handler: publishPostHandler,
        errorHandler: (err, req, rep) => rep.code(404).send(),
        schema: publishPostSchema,
    });

    fastify.route({
        method: 'POST',
        url: '/',
        onRequest: fastify.authenticate(),
        handler: createPostHandler,
        schema: createPostSchema,
    });

    fastify.route({
        method: 'GET',
        url: '/:postId',
        onRequest: fastify.authenticate({ allowAnonymous: true }),
        handler: getPostByIdHandler,
        errorHandler: (err, req, rep) => rep.code(404).send(),
        schema: getPostByIdSchema,
    });

    fastify.route({
        method: 'POST',
        url: '/:postId/comments',
        onRequest: fastify.authenticate(),
        handler: createPostCommentHandler,
        errorHandler: (err, req, rep) => rep.code(404).send(),
        schema: createPostCommentSchema,
    });
};

export default PostsRouter;
