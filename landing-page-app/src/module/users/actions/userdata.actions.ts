"use server";

import { UserService } from "../server/users.service";

export const UserData = async () => {
    return await UserService.SystemUser();
}