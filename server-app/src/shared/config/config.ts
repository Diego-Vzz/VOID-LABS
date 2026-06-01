import bcrypt from "bcrypt";
import { AppError } from "../utils/app-error.utils";

export class Config {
    public static readonly TEMP_ROLE = "USER_TEMP";
    public static async HashearPassword(password: string): Promise<string> {
        const contieneCaracteresInvisibles = /[\x00-\x1F\x7F]/.test(password.trim());

        if (contieneCaracteresInvisibles) {
            throw new AppError("Invalid password", 400, "Bad Request");
        }

        return await bcrypt.hash(password.trim(), await bcrypt.genSalt());
    }

    public static async ComparePassword(
        hashPassword: string,
        password: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }
}