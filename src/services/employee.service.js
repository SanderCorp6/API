const Employee = require("../models/employee.model");
const EmployeeHistory = require("../models/history.model");
const AppError = require("../utils/AppError");

class EmployeeService {
    static async create(e, userId) {
        if (!e.first_name || !e.last_name || !e.email || !e.phone_number || !e.address ||
            !e.birth_date || !e.hire_date || !e.contract_type ||
            !e.salary || !e.payroll_key || !e.periodicity || !e.cost_center ||
            !e.vacation_days_total ||
            !e.position || !e.department_id || !e.supervisor_id){
            throw new AppError("Incomplete fields for user creation", 409);
        }

        const existingEmployee = await Employee.getByEmail(e.email);
        if (existingEmployee) {
            throw new AppError("There is already an employee registered with that email.", 409);
        }

        e.created_by = userId;
        e.status = "Active";

        const newEmployee = await Employee.create(e);
        return newEmployee;
    }

    static async getAll(filters) {
        const employees = await Employee.getAll(filters);
        return employees;
    }

    static async getById(id) {
        const employee = await Employee.getById(id);
        if (!employee) {
            throw new AppError("Employee Not Found.", 404);
        }
        return employee;
    }

    static async update(id, dataToUpdate, userId) {
        const existingEmployee = await Employee.getById(id);
        if (!existingEmployee) {
            throw new AppError("Employee not found.", 404);
        }

        if (dataToUpdate.email && dataToUpdate.email !== existingEmployee.email) {
            const emailExists = await Employee.getByEmail(dataToUpdate.email);
            if (emailExists) {
                throw new AppError("Email is already in use by another employee.", 409);
            }
        }

        if (dataToUpdate.status) {
            const currentDate = new Date();
            if (dataToUpdate.status == "Active") {
                dataToUpdate.reentry_date = currentDate;
            } else {
                dataToUpdate.termination_date = currentDate;
                dataToUpdate.reentry_date = null;
            }
        }

        if (dataToUpdate.position && dataToUpdate.position !== existingEmployee.position) {
            await EmployeeHistory.create({
                employee_id: id,
                change_type: 'POSITION_CHANGE',
                description: `Change of position from ${existingEmployee.position} to ${dataToUpdate.position}`,
                previous_value: existingEmployee.position,
                new_value: dataToUpdate.position,
                created_by: userId
            });
        }

        if (dataToUpdate.salary && parseFloat(dataToUpdate.salary) !== parseFloat(existingEmployee.salary)) {
            await EmployeeHistory.create({
                employee_id: id,
                change_type: 'SALARY_CHANGE',
                description: `Salary adjustment from ${existingEmployee.salary} to ${dataToUpdate.salary}`,
                previous_value: existingEmployee.salary.toString(),
                new_value: dataToUpdate.salary.toString(),
                created_by: userId
            });
        }

        const employeeData = {
            ...existingEmployee,
            ...dataToUpdate,
            updated_by: userId,
        };

        const updatedEmployee = await Employee.update(id, employeeData);
        return updatedEmployee;
    }

    static async delete(id) {
        const deleted = await Employee.delete(id);
        if (!deleted) {
            throw new AppError("Employee not found.", 404);
        }
    }

    static async getStats() {
        const stats = await Employee.getStats();
        return stats;
    }

    static async addWarning(id, reason, userId) {
        const employee = await Employee.getById(id);
        if (!employee) throw new AppError("Employee not found", 404);

        return await EmployeeHistory.create({
            employee_id: id,
            change_type: 'WARNING',
            description: reason,
            previous_value: null,
            new_value: 'Recorded',
            created_by: userId
        });
    }

    static async getHistory(id) {
        return await EmployeeHistory.getByEmployeeId(id);
    }
}

module.exports = EmployeeService;
