import * as jwt from "jsonwebtoken";

import { TokensType } from "../types";

class TokenService {
  generateTokens(payload: object) : TokensType {
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '2h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY);

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token : string) : {email : string} {
    const payload = jwt.verify(token, process.env.ACCESS_KEY) as {email: string};
    return payload
  }

  getEmailFromBearer(bearerHeader: string): string{
    if(!bearerHeader){
        throw new Error("Bearer token is not found")
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    const payload = this.verifyAccessToken(bearerToken);
    if(!payload || !payload.email){
        throw new Error("Token error")
    }
    return payload.email;
  }
}

export default new TokenService();