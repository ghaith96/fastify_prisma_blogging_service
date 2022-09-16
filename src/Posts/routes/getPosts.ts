import { FastifyInstance, FastifyRequest, FastifyReply, RouteShorthandOptions } from "fastify";
import { getPublishedAndUserPosts } from "../service";

export const getPostsHandlerSchema = {
    response: {
        200: {
            type: 'array',
            items: { $ref: 'schema#/definitions/Post' }
        },
    },
};

export async function getPostsHandler(this: FastifyInstance, req: FastifyRequest, rep: FastifyReply) {
    return await getPublishedAndUserPosts(this.prisma, req.user);
}
