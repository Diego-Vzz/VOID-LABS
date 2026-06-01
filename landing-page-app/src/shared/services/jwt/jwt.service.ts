import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { UserPayload } from "./jwt.interface";
import { ACCESS_TOKEN_EXPIRY } from "@/shared/lib/cookie.utils";

class JwtServiceClass<T> {
    private secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    public async Sign(payload: T): Promise<string> {
        if (!payload) throw new Error("The data has not been specified");

        return await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(ACCESS_TOKEN_EXPIRY)
            .sign(this.secretKey);
    }

    public async Verify(token: string): Promise<T | null> {
        try {
            const { payload } = await jwtVerify(token, this.secretKey);
            return payload as T;
        } catch (error) {
            return null;
        }
    }
}
export const JwtService = <T>() => new JwtServiceClass<T>();