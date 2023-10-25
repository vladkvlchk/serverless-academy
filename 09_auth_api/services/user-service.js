const bcrypt = require("bcrypt")
const db = require("../db");
const tokenService = require("../services/token-service");

class UserService {
  async createUser(email, password) {
    const id = Date.now();
    const hashPassword = bcrypt.hashSync(password, 3);
    const query = "INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [id, email, hashPassword];
    const { accessToken, refreshToken } = tokenService.generateTokens({
        id: 0,
        email,
    });

    const { rows } = await db.query(query, values);
    return { id: rows[0].id, accessToken, refreshToken};
  }
}

module.exports = new UserService();
