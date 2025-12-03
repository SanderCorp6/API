const pool = require("../config/db.config");

class Position {
  static async getAll() {
    const query = `SELECT * FROM positions ORDER BY name ASC`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `SELECT * FROM positions WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Position;
