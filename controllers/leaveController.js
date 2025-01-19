import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId })
    const newLeave = new Leave({ employeeId: employee._id, leaveType, startDate, endDate, reason })
    await newLeave.save()

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'leave add server error' })
  }
}

const getLeave = async (req, res) => {
  try {
    const { id } = req.params;
    let leaves;
    leaves = await Leave.find({ employeeId: id });
    if (!leaves || leaves.length < 1) {
      leaves = await Leave.find({ _id: id })
        .populate({
          path: 'employeeId',
          populate: [
            {
              path: 'userId',
              select: ['name', 'profileImage'],
            },
            {
              path: 'department',
              select: 'dep_name',
            }
          ]
        });
    }
    if (!leaves || leaves.length < 1) {
      const employee = await Employee.findOne({ userId: id })
      if (employee) {
        leaves = await Leave.find({ employeeId: employee._id });
      }
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'leave get server error' })
  }
}


const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name',
        }
      ]
    })
    return res.status(200).json({ success: true, leaves })
  } catch (error) {
    return res.status(500).json({ success: true, error: 'Leaves get server error' })
  }
}

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate({ _id: id }, { status: status });
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave not founded' });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Leave update server error' });
  }
}
export { addLeave, getLeaves, getLeave, updateLeave }