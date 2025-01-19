import mongoose from 'mongoose';
import Employee from '../models/Employee.js'
import Leaves from '../models/Leave.js'
import Salary from '../models/Salary.js'

const departmentSchema = new mongoose.Schema({
    dep_name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

departmentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const employees = await Employee.find({ department: this._id });
        const empIds = employees.map((empId) => empId._id);

        await Employee.deleteMany({ department: this._id });
        await Leaves.deleteMany({ employeeId: { $in: empIds } });
        await Salary.deleteMany({ employeeId: { $in: empIds } });
        next()
    } catch (error) {
        next(error);
    }
})

const Department = mongoose.model('Department', departmentSchema);

export default Department;