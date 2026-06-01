import { JWTPayload } from "jose";

export interface UserPayload extends JWTPayload {
    username: string;
    email: string;
    role: string;
}