const pool = require("../config/db.config");
const AppError = require("../utils/AppError");

class Employee {
  // get employees, with dynamic filtering
  static async getAll(filters = {}) {
    let baseQuery = `
      SELECT
          e.id, 
          e.full_name, e.email,
          e.position_id, e.hire_date,
          e.department_id, e.status,
          e.salary,
          d.name AS department_name,
          p.name AS position_name
      FROM
          employees AS e
      LEFT JOIN
          departments AS d ON e.department_id = d.id
      LEFT JOIN
          positions AS p ON e.position_id = p.id
    `;

    const whereClauses = [];
    const params = [];

    if (filters.status) {
      params.push(filters.status);
      whereClauses.push(`e.status = $${params.length}`);
    }
    if (filters.departmentId) {
      params.push(filters.departmentId);
      whereClauses.push(`e.department_id = $${params.length}`);
    }
    if (filters.positionId) {
      params.push(filters.positionId);
      whereClauses.push(`e.position_id = $${params.length}`);
    }
    if (filters.search) {
      const searchTerm = filters.search.trim();

      params.push(`%${searchTerm}%`);
      whereClauses.push(`(e.full_name ILIKE $${params.length} OR e.email ILIKE $${params.length})`);
    }

    if (whereClauses.length > 0) {
      baseQuery += " WHERE " + whereClauses.join(" AND ");
    }

    const sortableColumns = {
      name: "name",
      department: "d.name",
      position: "p.name",
      status: "e.status",
      date: "e.hire_date",
      salary: "e.salary",
    };

    const sortBy = sortableColumns[filters.sortBy] ? filters.sortBy : "name";
    const sortDir = filters.sortDir && filters.sortDir.toUpperCase() === "DESC" ? "DESC" : "ASC";

    if (sortBy === "name") {
      baseQuery += ` ORDER BY e.full_name ${sortDir}`;
    } else {
      baseQuery += ` ORDER BY ${sortableColumns[sortBy]} ${sortDir}`;
    }

    const result = await pool.query(baseQuery, params);
    return result.rows;
  }

  static async getSimpleAll() {
    const query = `SELECT id, full_name 
      FROM employees  
      WHERE status = 'Active'
      ORDER BY full_name ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // find employee by id
  static async getById(id) {
    const query = `
      SELECT
          e.id, e.role,
          e.first_name, e.last_name, e.full_name,
          e.email, e.phone_number, e.address, e.birth_date, e.image_url,
          e.hire_date, e.termination_date, e.contract_type, e.position_id, 
          e.department_id, e.supervisor_id, e.status, e.reentry_date,
          e.salary, e.payroll_key, e.periodicity, e.cost_center,
          e.vacation_days_total, e.vacation_days_taken,
          d.name AS department_name,
          p.name AS position_name,
          s.full_name AS supervisor_full_name
      FROM
          employees AS e
      LEFT JOIN
          departments AS d ON e.department_id = d.id
      LEFT JOIN
          positions AS p ON e.position_id = p.id
      LEFT JOIN
          employees AS s ON e.supervisor_id = s.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // get by email
  static async getByEmail(email) {
    const query = `
      SELECT id, full_name, email, role, password, is_first_login, status 
      FROM employees WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // stats employees
  static async getStats() {
    const employeeStatsQuery = `
      SELECT
          COUNT(*) AS "totalEmployees",
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS "activeEmployees",
          SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) AS "inactiveEmployees"
      FROM
          employees
    `;

    const departmentStatsQuery = `SELECT COUNT(*) AS "totalDepartments" FROM departments`;

    try {
      const [employeeResult, departmentResult] = await Promise.all([
        pool.query(employeeStatsQuery),
        pool.query(departmentStatsQuery),
      ]);

      const employeeStats = employeeResult.rows[0];
      const departmentStats = departmentResult.rows[0];

      return {
        ...employeeStats,
        ...departmentStats,
      };
    } catch {
      throw new AppError("Could not fetch dashboard stats.", 500);
    }
  }

  // create employee
  static async create(e) {
    const query = `
      INSERT INTO employees
      (role, first_name, last_name, email, phone_number, address, birth_date, 
      contract_type, position_id, department_id, supervisor_id, status, 
      salary, payroll_key, periodicity, cost_center, 
      vacation_days_total)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
          $14, $15, $16, $17)
      RETURNING id, full_name, email, role, status
    `;
    const params = [
      e.role,
      e.first_name,
      e.last_name,
      e.email,
      e.phone_number,
      e.address,
      e.birth_date,
      e.contract_type,
      e.position_id,
      e.department_id,
      e.supervisor_id,
      e.status,
      e.salary,
      e.payroll_key,
      e.periodicity,
      e.cost_center,
      e.vacation_days_total,
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  // update employee
  static async update(id, e) {
    const query = `
      UPDATE employees SET
          first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5,
          birth_date = $6, hire_date = $7, termination_date = $8, contract_type = $9,
          position_id = $10, department_id = $11, supervisor_id = $12, status = $13,
          salary = $14, payroll_key = $15, periodicity = $16, cost_center = $17, 
          vacation_days_total = $18, vacation_days_taken = $19,
          reentry_date = $20, role = $21
      WHERE id = $22
      RETURNING *
    `;

    const params = [
      e.first_name,
      e.last_name,
      e.email,
      e.phone_number,
      e.address,
      e.birth_date,
      e.hire_date,
      e.termination_date,
      e.contract_type,
      e.position_id,
      e.department_id,
      e.supervisor_id,
      e.status,
      e.salary,
      e.payroll_key,
      e.periodicity,
      e.cost_center,
      e.vacation_days_total,
      e.vacation_days_taken,
      e.reentry_date,
      e.role,
      id,
    ];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  // delete employee
  static async delete(id) {
    try {
      const result = await pool.query("DELETE FROM employees WHERE id = $1", [id]);
      return result.rowCount > 0;
    } catch {
      throw new AppError("Cannot delete employee with existing dependencies.", 409);
    }
  }

  // set password
  static async setPassword(id, hashedPassword) {
    const query = `
      UPDATE employees 
      SET password = $1, is_first_login = false
      WHERE id = $2
      RETURNING id, email 
    `;
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }
}

module.exports = Employee;
