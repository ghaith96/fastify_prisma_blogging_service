import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getPostById, userAllowedToViewPost } from "../service";

export const getPostByIdSchema = {
    params: {
        postId: { type: 'number' },
    },
    response: {
        404: {},
        401: {},
        200: { $ref: 'schema#/definitions/Post', },
    }
};

export async function getPostByIdHandler(this: FastifyInstance, req: FastifyRequest<{ Params: { postId: number } }>, rep: FastifyReply) {
    const post = await getPostById(this.prisma, req.params.postId);

    if (!userAllowedToViewPost(post, req.user)) {
        throw new Error();
    }

    return post;
}
