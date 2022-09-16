import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { RouteGenericInterface, RouteShorthandOptions } from "fastify/types/route";
import bcrypt from 'bcrypt';

interface RegisterRequest extends RouteGenericInterface {
    Body: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
}

export const RegisterRouteOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["name", "email", "password", "confirmPassword",],
            properties: {
                "name": {
                    minLength: 3,
                    type: "string",
                },
                "email": { type: "string" },
                "password": {
                    minLength: 6,
                    maxLength: 64,
                    type: "string"
                },
                "confirmPassword": {
                    const: {
                        "$data": '1/password',
                    },
                    type: "string"
                },
            }
        }

    },
};

export async function registerUser(this: FastifyInstance, req: FastifyRequest<RegisterRequest>, rep: FastifyReply) {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 12);
        await this.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            }
        });
    } catch (e) {
        rep.code(400).send({ error: "user exist" });
    }
}
