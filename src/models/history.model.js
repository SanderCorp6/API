const pool = require("../config/db.config");

class EmployeeHistory {
    static async create(data) {
        const query = `
            INSERT INTO employee_history
            (employee_id, change_type, description, previous_value, new_value, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const params = [
            data.employee_id, data.change_type, data.description, 
            data.previous_value, data.new_value, data.created_by
        ];
        const result = await pool.query(query, params);
        return result.rows[0];
    }

    static async getByEmployeeId(employeeId) {
        const query = `
            SELECT h.*, u.name as changer_name 
            FROM employee_history h
            LEFT JOIN users u ON h.created_by = u.id
            WHERE employee_id = $1 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [employeeId]);
        return result.rows;
    }
}

module.exports = EmployeeHistory;
