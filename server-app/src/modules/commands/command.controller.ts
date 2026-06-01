import { FastifyReply, FastifyRequest } from "fastify";
import { CommandService } from "./command.service";
import { ITokenPayload } from "../auth";

class CommandControllerClass {
    public async ProcessCommand(req: FastifyRequest, reply: FastifyReply) {
        const result = await CommandService.ProcessCommand(req.user as ITokenPayload, req.body);
        return reply.code(200).send(result);
    }

    public async LoadConfig(req: FastifyRequest, reply: FastifyReply) {
        const result = await CommandService.LoadConfig(req.headers.authorization);
        return reply.code(200).send(result);
    }
}

export const CommandController = new CommandControllerClass();