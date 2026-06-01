import {
  ILoginParams,
  ILoginSystemUser,
  IRegisterParams,
  ITokenPayload,
} from "@/modules/auth/auth.interface";
import { Config } from "@/shared/config/config";
import prisma from "@/shared/database/prisma";
import { AppError } from "@/shared/utils/app-error.utils";
import { TokenManager } from "@/shared/utils/token-manager.utils";
import { void_system_users, void_users } from "@prisma/client";

class AuthServiceClass {
  private readonly PREFIX_COOKIE: string = "";
  constructor() {
    const isProduction = process.env.NODE_ENV;
    this.PREFIX_COOKIE = isProduction === "production" ? "__host-" : "__test-";
  }

  public async Me(user: ITokenPayload) {
    let userData: void_users | void_system_users;

    if (user.type === "SYSTEM") {
      userData = (await prisma.void_system_users.findUnique({
        where: { id: user.id },
        select: {
          username: true,
          email: true,
          role: true,
        },
      })) as void_system_users;
    } else {
      userData = (await prisma.void_users.findUnique({
        where: { id: user.id },
        select: {
          username: true,
          email: true,
          role: true,
        },
      })) as void_users;
    }

    if (!userData) {
      throw new AppError("User not found", 404, "Not Found");
    }

    return {
      username: userData.username,
      email: userData.email,
      role: userData.role,
    };
  }

  public async RegisterUser(params: IRegisterParams) {
    const { email, password, username } = params;

    return await prisma.$transaction(async (db) => {
      const existsUser = await db.void_users.findUnique({
        where: { email: email },
      });

      if (existsUser) {
        throw new AppError(
          "The user or email is already registered",
          409,
          "Conflict",
        );
      }

      const hashedPassword = await Config.HashearPassword(password);

      const user = await db.void_users.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          banned: false,
          hwid: null,
          role: "USER",
        },
      });

      const tokens = TokenManager.GenerateTokens(user, "WEB_SESSION", "USER");

      return {
        user: {
          email: user.email,
          username: user.username,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    });
  }

  public async LoginSystemUser(params: ILoginSystemUser) {
    return await prisma.$transaction(async (db) => {
      let user = await db.void_system_users.findUnique({
        where: { username: params.username, active: true },
        select: {
          id: true,
          password: true,
          role: true,
        },
      });

      if (!user) {
        throw new AppError("Invalid credentials", 400, "Bad Request");
      }

      const passwordIsValid = await Config.ComparePassword(
        user.password,
        params.password,
      );

      if (!passwordIsValid) {
        throw new AppError("Invalid credentials", 400, "Bad Request");
      }

      await db.void_system_users.update({
        where: { id: user.id },
        data: {
          last_login: new Date(),
        },
      });

      const user_data_token = {
        id: user.id,
        role: user.role,
      };

      const tokens = TokenManager.GenerateTokens(
        user_data_token,
        "WEB_SESSION",
        "SYSTEM",
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        route: "SYSTEM",
      };
    });
  }

  public async LoginUser(params: ILoginParams) {
    const { email, password, ticket_id } = params;
    if (!email || !password) {
      throw new AppError("Invalid credentials", 400, "Bad Request");
    }

    let user = await prisma.void_users.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 400, "Bad Request");
    }

    const passwordIsValid = await Config.ComparePassword(
      user.password,
      password,
    );
    if (!passwordIsValid) {
      throw new AppError("Invalid credentials", 400, "Bad Request");
    }

    if (user.banned) {
      throw new AppError(
        "License suspended or permanently banned.",
        403,
        "Forbidden",
      );
    }

    let route = "SITE";

    const pendingTicket = await prisma.void_hwid_bindings.findFirst({
      where: {
        id: ticket_id,
        expires_at: {
          gte: new Date(),
        },
      },
    });

    if (pendingTicket) {
      user = await this.ValidateHWIDLoginLoader(user, pendingTicket.temp_hwid);
      route = "VOID";
    }

    const hwidDefault = user.hwid || "WEB_SESSION";
    const tokens = TokenManager.GenerateTokens(user, hwidDefault, "USER");

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      route: route,
    };
  }

  private async ValidateHWIDLoginLoader(user: void_users, hwid: string) {
    if (hwid.startsWith("WEB_")) {
      throw new AppError("Invalid HWID", 403, "Forbidden");
    }

    if (user.hwid && user.hwid !== hwid) {
      throw new AppError("Invalid HWID", 403, "Forbidden");
    }

    return await prisma.void_users.update({
      where: { id: user.id },
      data: { hwid: hwid },
    });
  }

  public async ValidateHWIDLoader(hwid: string) {
    const user = await prisma.void_users.findUnique({
      where: { hwid: hwid },
    });

    if (!user) {
      const login = await prisma.void_hwid_bindings.create({
        data: {
          temp_hwid: hwid,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 1000 * 60 * 15),
        },
      });

      return {
        found: false,
        token: login.id,
        error: null,
      };
    }

    if (user.banned || user.ban_reason) {
      throw new AppError(
        user.ban_reason ?? "License suspended or permanently banned.",
        403,
        "Forbidden",
      );
    }

    const subscription = await prisma.void_subscriptions.findFirst({
      where: {
        user_id: user.id,
        active: true,
        expires_at: {
          gte: new Date(),
        },
      },
    });

    if (!subscription) {
      throw new AppError("No active subscription found.", 403, "Forbidden");
    }

    return {
      found: true,
      token: user.hwid,
      error: null,
    };
  }

  public async RefreshToken(headers: any) {
    const currentRefreshToken = headers[`${this.PREFIX_COOKIE}refresh_token`];

    const refreshToken = Array.isArray(currentRefreshToken)
      ? currentRefreshToken[0]
      : currentRefreshToken;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401, "Unauthorized");
    }

    const decoded = TokenManager.VerifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new AppError("Invalid refresh token", 401, "Unauthorized");
    }

    let user: any;

    if (decoded.type === "SYSTEM") {
      user = await prisma.void_system_users.findUnique({
        where: { id: decoded.id },
      });
    } else {
      user = await prisma.void_users.findUnique({
        where: { id: decoded.id },
      });
    }

    if (!user) {
      throw new AppError("User not found", 404, "Not Found");
    }

    const tokens = TokenManager.GenerateTokens(
      user,
      decoded.hwid,
      decoded.type,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}

export const AuthService = new AuthServiceClass();
