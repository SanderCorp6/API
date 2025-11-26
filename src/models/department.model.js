const pool = require('../config/db.config');

class Department {
    static async getAll() {
        const query = `SELECT * FROM departments`;
        const result = await pool.query(query);
        return result.rows;
    }
}

module.exports = Department;