const tokenService = require("../services/token-service");

class UserController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = tokenService.generateTokens({
        id: 0,
        email,
      });

      res.json({
        success: true,
        data: {
          id: "0",
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      res.status(409).json({ success: false, error: err.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      res.json({
        success: true,
        data: {
          id: "0",
          accessToken: "access_token",
          refreshToken: "refresh_token",
        },
      });
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async getUser(req, res) {
    try {
      res.json({
        success: true,
        data: {
          id: "0",
          accessToken: "access_token",
          refreshToken: "refresh_token",
        },
      });
    } catch (err) {
      res.sendStatus(500);
    }
  }
}

module.exports = new UserController();
