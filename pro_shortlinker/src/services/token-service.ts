import * as jwt from "jsonwebtoken";

import { TokensType } from "../types";

class TokenService {
  generateTokens(payload: object) : TokensType {
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '2h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token){
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    return payload
  }
}

export default new TokenService();