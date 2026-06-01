import prisma from "@/shared/database/prisma";
import { IAudit } from "./audit.interface";

class AuditServiceClass {
    public async AuditLog(params: IAudit) {
        return await prisma.$transaction(async (db) => {
            await db.void_audit_logs.create({
                data: params
            });

            return { log_created: true }
        });
    }
}

export const AuditService = new AuditServiceClass();