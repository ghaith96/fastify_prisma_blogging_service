import { User } from '@prisma/client';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (opts?: { allowAnonymous: boolean }) => (req: FastifyRequest, rep: FastifyReply) => void,
    }

    interface FastifyRequest {
        Headers: {
            'x-access-token': string;
        },
        user?: User;
    }
}

export const AuthPlugin: FastifyPluginAsync = fp(async (fastify, opts) => {

    fastify.decorate('authenticate', ({ allowAnonymous } = { allowAnonymous: false }) => async function (req: FastifyRequest, rep: FastifyReply) {
        const token = req.headers['x-access-token'] as string;
        if (!token || typeof token !== 'string') {
            if (allowAnonymous) {
                return;
            }
            rep.code(401).send();
        }

        try {
            const tokenInfo = await fastify.prisma.token.update({
                data: { lastAcccessed: new Date(), },
                where: { accessToken: token, },
                include: { user: true, },
            });

            req.user = tokenInfo.user;
        } catch (e) {
            if (allowAnonymous) {
                return;
            }
            rep.code(401).send();
        }
    });
});
