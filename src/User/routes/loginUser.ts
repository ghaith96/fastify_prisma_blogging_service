import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RouteGenericInterface, RouteShorthandOptions } from "fastify/types/route";

interface LoginUserRequest extends RouteGenericInterface {
    Body: {
        email: string;
        password: string;
    }
}

export const LoginUserRouteOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            requiredProperties: ['email', 'password',],
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
            }
        }
    }
}

export async function loginUser(this: FastifyInstance, req: FastifyRequest<LoginUserRequest>, rep: FastifyReply) {
    const { email, password } = req.body;

    try {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { email: email }
        });

        const isCorrectPassword = bcrypt.compareSync(password, user.password);
        if (!isCorrectPassword) {
            throw new Error('Wrong username/password');
        }

        const tokenInfo = {
            accessToken: crypto.randomBytes(48).toString('hex'),
        };

        const token = await this.prisma.token.upsert({
            where: { userId: user.id },
            update: tokenInfo,
            create: {
                ...tokenInfo,
                userId: user.id,
                refreshToken: crypto.randomBytes(48).toString('hex'),
            }
        });

        rep.code(200).send({
            token: token.accessToken,
            expiresAt: new Date(token.createdAt.setHours(token.createdAt.getHours() + 1)),
        });
    } catch (e) {
        rep.code(401).send(e.message ? { error: e.message } : undefined);
    }

}
