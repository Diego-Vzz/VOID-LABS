export interface IAudit {
    user_id: string;
    target_id?: string;
    action: string;
    details?: string;
    ip_address?: string;
}