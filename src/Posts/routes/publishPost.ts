import { FastifyInstance, FastifyRequest } from "fastify";
import { publishPostById } from "../service";

export const publishPostSchema = {
    params: {
        type: 'object',
        required: ['postId',],
        properties: {
            postId: { type: 'number', },
        },
    },
    response: {
        200: {
            type: 'object',
            items: { $ref: 'schema#/definitions/Post', }
        }
    }
};


export async function publishPostHandler(this: FastifyInstance, req: FastifyRequest<{ Params: { postId: number } }>, rep) {
    return await publishPostById(this.prisma, req.user, req.params.postId);
}
