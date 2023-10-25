const jwt = require("jsonwebtoken");

class TokenService {
  generateTokens(payload) {
      console.log(process.env.ACCESS_SECRET);
    const accessToken = jwt.sign(payload, 'I_love_serverless', {
      expiresIn: "6h",
    });
    const refreshToken = jwt.sign(payload, 'I_am_serverless_too', {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new TokenService();
