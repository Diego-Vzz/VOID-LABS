
import { FastifyReply, FastifyRequest } from "fastify";
import { ILoginParams, ILoginSystemUser, IRegisterParams, ITokenPayload } from "./auth.interface";
import { AuthService } from "./auth.service";

export class AuthControllerClass {
    public async Register(req: FastifyRequest, reply: FastifyReply) {
        const result = await AuthService.RegisterUser(req.body as IRegisterParams);
        return reply.code(201).send(result);
    }

    public async Login(req: FastifyRequest, reply: FastifyReply) {
        const result = await AuthService.LoginUser(req.body as ILoginParams);
        return reply.code(200).send(result);
    }

    public async SystemLogin(req: FastifyRequest, reply: FastifyReply) {
        const result = await AuthService.LoginSystemUser(req.body as ILoginSystemUser);
        return reply.code(200).send(result);
    }

    public async RefreshToken(req: FastifyRequest, reply: FastifyReply) {
        const result = await AuthService.RefreshToken(req.headers);
        return reply.code(200).send(result);
    }

    public async Loader(req: FastifyRequest, reply: FastifyReply) {
        const params = req.params as { hwid: string };
        const result = await AuthService.ValidateHWIDLoader(params.hwid);
        return reply.code(200).send(result);
    }

    public async Me(req: FastifyRequest, reply: FastifyReply) {

        const result = await AuthService.Me(req.user as ITokenPayload);
        return reply.code(200).send(result);
    }
}

export const AuthController = new AuthControllerClass();