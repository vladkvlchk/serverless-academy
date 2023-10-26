const bcrypt = require("bcrypt");
const db = require("../db");
const tokenService = require("../services/token-service");

class UserService {
  async createUser(email, password) {
    //checking if user with this email already exists
    const data = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if(data.rows[0]) throw new Error("Request error: user with this email already exists")

    //registration
    const id = Date.now();
    const hashPassword = bcrypt.hashSync(password, 3);
    const query = "INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [id, email, hashPassword];
    const tokens = tokenService.generateTokens({ id, email });

    const { rows } = await db.query(query, values);
    return { id: rows[0].id, ...tokens };
  }

  async signIn(email, password) {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await db.query(query, [email]);
    if (!rows[0]) throw new Error("User isn't found");

    const isPassEquals = await bcrypt.compare(password, rows[0].password);
    if (!isPassEquals) throw new Error("Incorrect password");

    const tokens = await tokenService.generateTokens({ id: rows[0].id, email });

    return { id: rows[0].id, ...tokens };
  }

  async getMe(token) {
    return tokenService.verifyAccessToken(token);
  }
}

module.exports = new UserService();
