const pool = require("../config/db.config");

class User {
    // return all users
    static async getAll() {
        const result = await pool.query("SELECT id, name, role, email FROM Users");
        return result.rows;
    }

    // create user
    static async create(name, role, email, hashedPassword) {
        const result = await pool.query(
            "INSERT INTO Users (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, role, email, hashedPassword]
        );
        return result.rows[0];
    }

    // find user by email
    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
        return result.rows[0];
    }

    // delete user
    static async delete(email) {
        const result = await pool.query("DELETE FROM Users WHERE email = $1", [email]);
        return result.rowCount > 0;
    }
}

module.exports = User;