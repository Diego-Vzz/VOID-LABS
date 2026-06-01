import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./users.service";
import { ITokenPayload } from "../auth";
import { IRole, IUser } from "./users.interface";

class UserControllerClass {
    public async SystemUsersListAll(req: FastifyRequest, reply: FastifyReply) {
        const result = await UserService.SystemUsersListAll();
        return reply.code(201).send(result);
    }

    public async UsersListAll(req: FastifyRequest, reply: FastifyReply) {
        const result = await UserService.UsersListAll();
        return reply.code(201).send(result);
    }

    public async CreateSystemUser(req: FastifyRequest, reply: FastifyReply) {
        const body = req.body as IUser;
        const data: IUser = {
            username: body.username,
            email: body.email,
            password: body.password,
            last_ip: req.ip,
            active: true,
            role: body.role
        }
        console.clear()
        console.log(data)
        const result = await UserService.CreateSystemUser(
            data,
            req.user as ITokenPayload
        );
        return reply.code(201).send(result);
    }

    public async _CreateDefaultUserSystemAdmin(req: FastifyRequest, reply: FastifyReply) {
        const result = await UserService._CreateDefaultUserSystemAdmin();
        return reply.code(201).send(result);
    }

    public async DashboardData(req: FastifyRequest, reply: FastifyReply) {
        const result = await UserService.DashboardData();
        return reply.code(201).send(result);
    }
}

export const UserController = new UserControllerClass();