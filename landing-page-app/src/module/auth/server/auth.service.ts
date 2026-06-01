import { ApiService } from "@/shared/services/api";
import { IAuthResponse, ILogin, IRefreshToken, IRegister, ISystemLoginUser } from "./auth.interface";
import { IPreviewUserData } from "@/module/users";

class AuthServiceClass {
    private readonly PREFIX: string = "/auth";

    public async RegisterUser(data: IRegister) {
        return await ApiService.Request<IAuthResponse>({
            method: "POST",
            endpoint: `${this.PREFIX}/register`,
            body: data,
        });
    }

    public async LoginUser(data: ILogin) {
        return await ApiService.Request<IAuthResponse>({
            method: "POST",
            endpoint: `${this.PREFIX}/login`,
            body: data,
        });
    }

    public async SystemLoginUser(data: ISystemLoginUser) {
        return await ApiService.Request<IAuthResponse>({
            method: "POST",
            endpoint: `${this.PREFIX}/sys/login`,
            body: data,
        });
    }

    public async Me() {
        const ls = await ApiService.Request<IPreviewUserData>({
            method: "GET",
            endpoint: `${this.PREFIX}/me`,
        });
        return ls;
    }

    public async SysMe() {
        const ls = await ApiService.Request<IPreviewUserData>({
            method: "GET",
            endpoint: `${this.PREFIX}/sys/me`,
        });
        return ls;
    }

    public async RefreshToken() {
        return await ApiService.Request<IRefreshToken>({
            method: "GET",
            endpoint: `${this.PREFIX}/refresh-token`,
        });
    }
}

export const AuthService = new AuthServiceClass();