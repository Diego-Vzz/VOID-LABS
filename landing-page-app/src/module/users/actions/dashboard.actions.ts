"use server";

import { UserService } from "../server/users.service";

export const ObtainInitialData = async () => await UserService.DashboardData();