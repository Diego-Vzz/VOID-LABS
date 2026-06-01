import { FastifyInstance } from "fastify";
import { UserController } from "./users.controller";
import authenticate from "@/middlewares/auth.middleware";
import { UserSchema } from "./users.schemas";

class UserRouteClass {
    private readonly PREFIX: string = "/user";

    public async Routes(fastify: FastifyInstance) {
        fastify.get(
            `${this.PREFIX}/sys/list`,
            Config.Authenticate,
            UserController.SystemUsersListAll
        );

        fastify.get(
            `${this.PREFIX}/client/list`,
            Config.Authenticate,
            UserController.UsersListAll
        );

        fastify.post(
            `${this.PREFIX}/sys/create`,
            Config.CreateUser,
            UserController.CreateSystemUser
        );

        fastify.post(
            `${this.PREFIX}/sys/automatic/create`,
            UserController._CreateDefaultUserSystemAdmin
        );

        fastify.get(
            `${this.PREFIX}/sys/dashboard`,
            Config.Authenticate,
            UserController.DashboardData
        );
    }
}

class Config {
    public static Authenticate = {
        onRequest: [authenticate],
    }

    public static CreateUser = {
        schema: UserSchema.Create,
        onRequest: [authenticate],
        config: {
            rateLimit: {
                max: 5,
                timeWindow: "1 hour",
            },
        },
    }
}

export const UserRoute = new UserRouteClass();