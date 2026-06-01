import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from './module/auth';
import { ACCESS_TOKEN_EXPIRY, getCookieOptions } from './shared/lib/cookie.utils';
import { Funcitons } from './shared/lib/functions.utils';
import { JwtService } from './shared/services/jwt';
import { AppRouteType, IRoute } from './shared/interfaces/auth.interface';

interface IApps {
    app: string,
    login: string
}

//const allowedRoles: string[] = ["ADMIN"];
const apps: IApps[] = [
    {
        app: "/system",
        login: "/system/login"
    },
    {
        app: "/void",
        login: "/void/login"
    }
];

const authRoutes: string[] = apps.map(item => item.login);
const protectedRoutes: string[] = apps.map(item => item.app);

const getCookiePrefix = (isProduction: boolean): string => isProduction ? "__Host-" : "__Test-";

const UrlAuth = (request: NextRequest, force?: string | null): URL => {
    console.log(force)
    switch (force) {
        case "SITE":
            return new URL('/', request.url);
        case "SYSTEM":
            return new URL('/system/login', request.url);
        case "VOID":
            return new URL('/void/login', request.url);
        default:
            const pathName = request.nextUrl.pathname;

            const matchedApp = apps.find(item =>
                pathName === item.app || pathName.startsWith(`${item.app}/`)
            );

            if (matchedApp) {
                return new URL(matchedApp.login, request.url);
            }

            return new URL('/', request.url);
    }
}



export const proxy = async (request: NextRequest) => {
    const pathName = request.nextUrl.pathname;
    const isProduction = process.env.NODE_ENV === "production";
    const cookiePrefix = getCookiePrefix(isProduction);

    const accessToken = request.cookies.get(`${cookiePrefix}access_token`)?.value;
    const refreshToken = request.cookies.get(`${cookiePrefix}refresh_token`)?.value;
    const route_user = request.cookies.get(`${cookiePrefix}route_user`)?.value;

    const isProtectedRoute = protectedRoutes.some(route => pathName === route || pathName.startsWith(`${route}/`));

    const isAuthRoutes = authRoutes.some(route => pathName === route);
    const notAccessible = !isAuthRoutes && !accessToken && !refreshToken;

    if (isProtectedRoute && notAccessible) {
        const response = NextResponse.redirect(UrlAuth(request, route_user ?? null));

        Funcitons.DeleteAllCookies(response);

        return response;
    }


    if (!accessToken && refreshToken) {
        const newAccess = await AuthService.RefreshToken();
        console.clear();
        console.log(newAccess)
        if (!newAccess.success || !newAccess.data) {

            const response = isAuthRoutes
                ? NextResponse.next()
                : NextResponse.redirect(UrlAuth(request));

            Funcitons.DeleteAllCookies(response);

            return response;
        }

        const data = newAccess.data;
        const response = NextResponse.next();
        response.cookies.set(`${cookiePrefix}access_token`, data.accessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY));
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)',
    ],
};