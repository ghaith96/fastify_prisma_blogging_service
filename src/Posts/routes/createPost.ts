import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createPost } from "../service";

export const createPostSchema = {
    body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
        }
    },
    response: {
        201: { $ref: 'schema#/definitions/Post' },
    }
};

export async function createPostHandler(this: FastifyInstance, req: FastifyRequest<{ Body: { content: string, title: string } }>, rep: FastifyReply) {
    const { title, content } = req.body;
    const post: Prisma.PostUncheckedCreateInput = {
        content,
        title,
        userId: req.user.id,
    };

    return await createPost(this.prisma, post);
}
