import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const defaultAttendance = async (req, res, next) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const existingAttendance = await Attendance.find({ date });
    if (existingAttendance.length == 0) {
      const employees = await Employee.find({});
      const attendance = employees.map(employee => ({
        date, employeeId: employee._id, status: null
      }))
      await Attendance.insertMany(attendance);
    }
    next();
  }
  catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

export default defaultAttendance;