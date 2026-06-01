"use server";

import { ICreateSystemUser } from "../server/users.interface";
import { UserService } from "../server/users.service";

export async function SystemUser(params: ICreateSystemUser) {
    const result = await UserService.CreateSystemUser(params);
    return result;
}