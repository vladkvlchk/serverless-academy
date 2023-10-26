const userService = require("../services/user-service");

class UserController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;

      const data = await userService.createUser(email, password);

      res.json({ success: true, data });
    } catch (err) {
      console.log(err)
      res.status(409).json({ success: false, error: err.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const data = await userService.signIn(email, password);

      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
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
