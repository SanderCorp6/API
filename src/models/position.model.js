const pool = require("../config/db.config");

class Position {
  static async getAll() {
    const query = `SELECT * FROM positions ORDER BY name ASC`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Position;
