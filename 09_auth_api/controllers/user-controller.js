const userService = require("../services/user-service");
const { checkEmail, checkPassword } = require("../validation");

class UserController {
  async signUp(req, res) {
    try {
      const { email, password } = req.body;
      checkEmail(email);
      checkPassword(password);

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

  async getMe(req, res) {
    try {
      const {id, email} = await userService.getMe(req.token);

      res.json({
        success: true,
        data: {
          id,
          email
        },
      });
    } catch (err) {
      res.sendStatus(500);
    }
  }
}

module.exports = new UserController();
