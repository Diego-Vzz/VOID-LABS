import {
    getCookiePrefix,
    getCookieOptions,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
} from "@/shared/lib/cookie.utils";

/**
 * Centraliza todas las operaciones de cookies del servidor.
 * Usa import dinámico de "next/headers" para evitar errores
 * cuando el módulo es importado transitivamente desde componentes cliente.
 */
export class CookieService {
    private static async getCookieStore() {
        const { cookies } = await import("next/headers");
        return cookies();
    }

    /** Lee los tokens de las cookies y devuelve headers de autenticación */
    public static async GetAuthHeaders(): Promise<Record<string, string>> {
        try {
            const cookieStore = await this.getCookieStore();
            const prefix = getCookiePrefix();
            const token = cookieStore.get(`${prefix}access_token`)?.value;

            const refreshToken = cookieStore.get(`${prefix}refresh_token`)?.value;

            const headers = { ...(token && { Authorization: `Bearer ${token}` }), };

            return {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(refreshToken && { [`${prefix}refresh_token`]: refreshToken }),
            };
        } catch {
            return {};
        }
    }

    public static async SetCookie(key: string, data: any, expiresMs: number) {
        const cookieStore = await this.getCookieStore();
        const prefix = getCookiePrefix();

        cookieStore.set(
            `${prefix}${key}`,
            data,
            getCookieOptions(expiresMs),
        );
    }

    /** Establece las cookies de autenticación (access + refresh) */
    public static async SetAuthCookies(accessToken: string, refreshToken?: string) {
        const cookieStore = await this.getCookieStore();
        const prefix = getCookiePrefix();

        cookieStore.set(
            `${prefix}access_token`,
            accessToken,
            getCookieOptions(ACCESS_TOKEN_EXPIRY),
        );

        console.log(refreshToken)

        if (refreshToken) {
            cookieStore.set(
                `${prefix}refresh_token`,
                refreshToken,
                getCookieOptions(REFRESH_TOKEN_EXPIRY),
            );
        }
    }

    /** Elimina ambas cookies de autenticación */
    public static async DeleteAuthCookies() {
        const cookieStore = await this.getCookieStore();
        const prefix = getCookiePrefix();

        cookieStore.delete(`${prefix}refresh_token`);
        cookieStore.delete(`${prefix}access_token`);
    }
}
