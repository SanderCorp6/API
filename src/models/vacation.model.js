const pool = require("../config/db.config");

class VacationRequest {
  static async create(data) {
    const query = `
            INSERT INTO vacation_requests
            (employee_id, start_date, end_date, days_requested, type, description, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
            RETURNING *
        `;
    const params = [data.employee_id, data.start_date, data.end_date, data.days_requested, data.type, data.description];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async getByEmployeeId(employeeId) {
    const query = `SELECT * FROM vacation_requests WHERE employee_id = $1 ORDER BY created_at DESC`;
    const result = await pool.query(query, [employeeId]);
    return result.rows;
  }

  static async getAll() {
    const query = `
      SELECT vr.*, e.full_name as employee_name 
      FROM vacation_requests vr
      JOIN employees e ON vr.employee_id = e.id
      ORDER BY vr.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `SELECT * FROM vacation_requests WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(requestId, status, userId) {
    const query = `UPDATE vacation_requests SET status = $1, reviewed_by = $2 WHERE id = $3 RETURNING *`;
    const result = await pool.query(query, [status, userId, requestId]);
    return result.rows[0];
  }

  static async checkOverlap(employeeId, startDate, endDate) {
    const query = `
            SELECT * FROM vacation_requests 
            WHERE employee_id = $1 
            AND status != 'Rejected'
            AND (
                (start_date <= $2 AND end_date >= $2) OR
                (start_date <= $3 AND end_date >= $3)
            )
        `;
    const result = await pool.query(query, [employeeId, startDate, endDate]);
    return result.rowCount > 0;
  }
}

module.exports = VacationRequest;
