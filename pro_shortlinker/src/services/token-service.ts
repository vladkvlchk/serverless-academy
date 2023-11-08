import * as jwt from "jsonwebtoken";

import { TokensType } from "../types";
import CustomError from "../exceptions/custom-error";

class TokenService {
  generateTokens(payload: object): TokensType {
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, {
      expiresIn: "2h",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY);

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): { email: string } {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_KEY) as {
        email: string;
      };
      return payload;
    } catch (error) {
      CustomError.throwError(401, "Unauthorized");
    }
  }

  getEmailFromBearer(bearerHeader: string): string {
    if (!bearerHeader) {
      CustomError.throwError(401, "Unauthorized");
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    const payload = this.verifyAccessToken(bearerToken);
    if (!payload || !payload.email) {
      CustomError.throwError(401, "Unauthorized");
    }
    return payload.email;
  }
}

export default new TokenService();
