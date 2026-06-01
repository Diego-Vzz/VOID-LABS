import { IPreviewUserData } from "@/module/users";
import { AppRouteType } from "@/shared/interfaces/auth.interface";

export interface IRegister {
    username: string;
    email: string;
    password: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    route: AppRouteType;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ISystemLoginUser {
    username: string;
    password: string;
}

export interface IRefreshToken {
    accessToken: string;
}

export interface IAuthState {
    user: IPreviewUserData | null;
    isAuthenticated: boolean;
    setUser: (user: IPreviewUserData | null) => void;
}