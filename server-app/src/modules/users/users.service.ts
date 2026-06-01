import prisma from "@/shared/database/prisma";
import { IRole, ISystemRole, IUser } from "./users.interface";
import { AppError } from "@/shared/utils/app-error.utils";

import { Config } from "@/shared/config/config";
import { ITokenPayload } from "../auth";
import { AuditService, IAudit } from "../audit";

class UserServiceClass {
    public async _CreateDefaultUserSystemAdmin() {
        return await prisma.$transaction(async (db) => {
            const passsword = await Config.HashearPassword("Diegogpe30");
            await db.void_system_users.create({
                data: {
                    username: "GhostKira",
                    email: "diego.avzz2004@gmail.com",
                    password: passsword,
                    role: "SUPERADMIN"
                }
            });

            return "created";
        })
    }

    public async SystemUsersListAll() {
        const system_user_data = await prisma.void_system_users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                active: true,
                role: true,
                _count: {
                    select: {
                        audit_logs: true
                    }
                }
            }
        });

        const users_data = await prisma.void_users.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                banned: true
            }
        });

        const data_result_customer = users_data.map(user => {
            return {
                id: user.id,
                username: user.username,
                status: user.banned ? "Banned" : "Active",
                role_name: user.role,
                has_audit_logs: false
            }
        });

        const data_result = system_user_data.map(user => {
            return {
                id: user.id,
                username: user.username,
                status: user.active ? "Active" : "Inactive",
                role_name: user.role,
                has_audit_logs: user._count.audit_logs > 0
            }
        });

        return [...(data_result), ...(data_result_customer)];
    }

    public async UsersListAll() {
        const data = await prisma.void_users.findMany();
        return { users: data }
    }

    public async CreateSystemUser(params: IUser, user: ITokenPayload) {
        return await prisma.$transaction(async (db) => {
            const user_exists = await prisma.void_system_users.findFirst({
                where: {
                    OR: [
                        { username: params.username.trim() },
                        { email: params.email.trim() }
                    ],
                    active: true
                },
                select: { id: true }
            });

            if (user_exists) {
                throw new AppError("User already exists", 409, `Conflict`);
            }

            const hashedPassword = await Config.HashearPassword(params.password);

            const user_created = await db.void_system_users.create({
                data: {
                    username: params.username,
                    password: hashedPassword,
                    email: params.email,
                    last_ip: params.last_ip,
                    role: params.role
                }
            });

            const audit: IAudit = {
                user_id: user.id,
                action: `CREATED USER '${user_created.username}'`
            }

            await AuditService.AuditLog(audit);
        });
    }

    public async DashboardData() {
        const count_users = await prisma.void_users.count({
            where: { banned: false }
        });

        const count_users_system = await prisma.void_system_users.count({
            where: { active: true, }
        });


        const total_users = count_users_system + count_users;

        const count_users_banned = await prisma.void_users.count({
            where: {
                banned: true
            }
        });

        const count_pending_tickets = await prisma.void_tickets.count({
            where: { status: "OPEN" }
        });

        return {
            data_preview: {
                users: total_users,
                banned: count_users_banned,
                tickets: count_pending_tickets
            }
        }
    }
}

export const UserService = new UserServiceClass();