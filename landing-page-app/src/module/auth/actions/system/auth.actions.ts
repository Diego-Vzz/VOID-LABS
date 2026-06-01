"use server";

import { CookieService } from "@/shared/services/cookies/cookie.service";
import { ISystemLoginUser } from "../../server/auth.interface";
import { AuthService } from "../../server/auth.service";
import { REFRESH_TOKEN_EXPIRY } from "@/shared/lib/cookie.utils";

export async function Login(credentials: ISystemLoginUser) {
    const res = await AuthService.SystemLoginUser(credentials);

    if (res.success && res.data) {
        const data = res.data;
        await CookieService.SetAuthCookies(
            data.accessToken,
            data.refreshToken
        );

        await CookieService.SetCookie("route_user", data.route, REFRESH_TOKEN_EXPIRY);
    }

    return res;
}

export const SysMe = async () => {
    const res = await AuthService.SysMe();
    if (res.success && res.data) {
        return res.data;
    } else {
        return null;
    }
}