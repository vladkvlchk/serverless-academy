const jwt = require("jsonwebtoken");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET , {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token){
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    return payload
  }
}

module.exports = new TokenService();
