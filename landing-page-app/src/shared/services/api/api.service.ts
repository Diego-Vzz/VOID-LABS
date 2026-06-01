import { CookieService } from "../cookies/cookie.service";
import { IApiErrorDetails, IApiRequest, IApiResponse } from "./api.interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TIMEOUT_MS = 30_000;
const REFRESH_ENDPOINT = "/auth/refresh-token";

class ApiServiceClass {
    private ok<T>(data: T): IApiResponse<T> {
        return { success: true, data, message: "Request successful" }
    }
    private fail<T>(message: string, errorType?: string, errorDetails?: IApiErrorDetails): IApiResponse<T> {
        return { success: false, data: null, message, errorType, errorDetails }
    }
    private async SafeJson(response: Response): Promise<any> {
        return response.json().catch(() => null)
    }
    private async ParseResponse<T>(response: Response): Promise<IApiResponse<T>> {
        const data = await this.SafeJson(response)

        if (response.ok) return this.ok(data)

        // 1. Asegurarnos de que el mensaje de error siempre sea un String
        let errorMessage = "Unknown error occurred";

        if (data?.message) {
            if (typeof data.message === "string") {
                errorMessage = data.message;
            } else if (Array.isArray(data.message)) {
                // Si el backend devuelve un arreglo de errores: ["Falta password", "Falta user"]
                errorMessage = data.message.join(", ");
            } else {
                // Si el backend devuelve un objeto complejo
                errorMessage = JSON.stringify(data.message);
            }
        } else if (response.statusText) {
            errorMessage = response.statusText;
        }

        return this.fail(
            errorMessage,
            data?.error || "Error",
            data?.details,
        )
    }

    private async ExecuteFetch(
        method: string,
        endpoint: string,
        body?: Record<string, any>,
        headers: Record<string, string> = {},
        authHeaders: Record<string, string> = {},
    ): Promise<Response> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

        try {
            return await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json", ...authHeaders, ...headers },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
                cache: "no-store",
            })
        } finally {
            clearTimeout(timeoutId)
        }
    }

    private async TryRefreshToken(authHeaders: Record<string, string>): Promise<string | null> {
        try {
            const response = await this.ExecuteFetch("GET", REFRESH_ENDPOINT, undefined, {}, authHeaders)
            if (!response.ok) return null

            const data = await this.SafeJson(response)
            return data?.accessToken ?? null
        } catch {
            return null
        }
    }

    public async Request<T>(params: IApiRequest): Promise<IApiResponse<T>> {
        const authHeaders = await CookieService.GetAuthHeaders()

        try {
            const response = await this.ExecuteFetch(params.method, params.endpoint, params.body, params.headers, authHeaders)

            if (response.status === 401 && params.endpoint !== REFRESH_ENDPOINT) {
                const newToken = await this.TryRefreshToken(authHeaders)

                if (!newToken) {
                    const data = await this.SafeJson(response)
                    return this.fail<T>(data?.message || "Unauthorized", "Unauthorized")
                }

                const retryAuth = { ...authHeaders, Authorization: `Bearer ${newToken}` }
                return this.ParseResponse<T>(await this.ExecuteFetch(params.method, params.endpoint, params.body, params.headers, retryAuth))
            }

            return this.ParseResponse<T>(response)
        } catch (error: any) {
            if (error.name === "AbortError") {
                return this.fail<T>("Request timed out", "Timeout")
            }
            return this.fail<T>(error.message || "Network error or lost connection", "Network")
        }
    }
}

export const ApiService = new ApiServiceClass();