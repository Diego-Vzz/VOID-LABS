export const SystemRolesTuple = ["SUPERADMIN", "BOT_N8N"] as const;
export type ISystemRole = typeof SystemRolesTuple[number];

export type IUserStatus = "Active" | "Inactive" | "Banned";

export interface IPreviewUserData {
    email: string;
    username: string;
    role: string;
}

export interface IDashboardData {
    data_preview: {
        users: number;
        banned: number;
        tickets: number;
    }
}

export interface IUserData {
    id: string;
    username: string;
    status: IUserStatus;
    role_name: string | null;
    has_audit_logs: boolean;
}

export interface ICreateSystemUser {
    username: string;
    email: string;
    password: string;
    role: ISystemRole;
}