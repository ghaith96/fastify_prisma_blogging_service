import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getPostById, postComment } from "../service";

export const createPostCommentSchema = {
    params: {
        type: 'object',
        required: ['postId'],
        properties: {
            postId: { type: 'number' }
        }
    },
    body: {
        type: 'object',
        required: ['content'],
        properties: {
            content: { type: 'string' },
        },
    },
    response: {
        404: {},
        201: { $ref: 'schema#/definitions/Comment', },
    },
}

export async function createPostCommentHandler(this: FastifyInstance, req: FastifyRequest<{ Params: { postId: number }, Body: { content: string } }>, rep: FastifyReply) {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await getPostById(this.prisma, postId);

    const createdComment = await postComment(
        this.prisma,
        {
            content,
            postId: post.id,
            userId: req.user.id,
        });

    rep.code(201).send(createdComment);
}
