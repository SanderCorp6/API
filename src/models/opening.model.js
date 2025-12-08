const pool = require("../config/db.config");

class Opening {
  static async create(data) {
    const query = `
      INSERT INTO openings (
        title, 
        position_id, 
        department_id, 
        hiring_manager_id,
        description, 
        responsibilities, 
        requirements,
        salary_min, 
        salary_max, 
        contract_type, 
        work_mode,
        location, 
        schedule, 
        target_date, 
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Open')
      RETURNING *
    `;

    const params = [
      data.title,
      data.position_id,
      data.department_id,
      data.hiring_manager_id,
      data.description,
      data.responsibilities,
      data.requirements,
      data.salary_min,
      data.salary_max,
      data.contract_type,
      data.work_mode,
      data.location,
      data.schedule,
      data.target_date,
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async getAll(status = null) {
    let query = `
      SELECT o.*, p.name as position_name, d.name as department_name
      FROM openings o
      LEFT JOIN positions p ON o.position_id = p.id
      LEFT JOIN departments d ON o.department_id = d.id
    `;

    const params = [];
    if (status) {
      query += ` WHERE o.status = $1`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const query = `
      SELECT o.*, p.name as position_name, d.name as department_name
      FROM openings o
      LEFT JOIN positions p ON o.position_id = p.id
      LEFT JOIN departments d ON o.department_id = d.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Opening;
