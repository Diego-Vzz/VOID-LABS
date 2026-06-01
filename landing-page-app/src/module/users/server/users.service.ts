import { ApiService } from "@/shared/services/api";
import { ICreateSystemUser, IDashboardData, IUserData } from "./users.interface";

class UserServiceClass {
    private readonly PREFIX: string = "/user";

    public async DashboardData() {
        return await ApiService.Request<IDashboardData>({
            method: "GET",
            endpoint: `${this.PREFIX}/sys/dashboard`
        });
    }

    public async SystemUser() {
        return await ApiService.Request<IUserData[]>({
            method: "GET",
            endpoint: `${this.PREFIX}/sys/list`
        });
    }

    public async CreateSystemUser(params: ICreateSystemUser) {
        return await ApiService.Request<IUserData[]>({
            method: "POST",
            endpoint: `${this.PREFIX}/sys/create`,
            body: params
        });
    }
}
export const UserService = new UserServiceClass();