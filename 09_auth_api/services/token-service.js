const jwt = require("jsonwebtoken");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, 'I_love_serverless', {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, 'I_am_serverless_too');
    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new TokenService();
