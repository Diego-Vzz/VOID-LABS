export const SystemRolesTuple = ["SUPERADMIN", "BOT_N8N"] as const;
export type ISystemRole = typeof SystemRolesTuple[number];

export interface IUser {
    username: string;
    email: string;
    password: string;
    last_ip: string;
    active: boolean;
    role: ISystemRole;
}

export interface IRole {
    name: string;
    active: boolean;
}