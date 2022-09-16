import { FastifyPluginAsync } from "fastify";
import {
    loginUser,
    RegisterRouteOptions,
    registerUser
} from "./routes";

const UserRouter: FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/login', loginUser);
    fastify.post('/register', RegisterRouteOptions, registerUser);
};

export default UserRouter;
