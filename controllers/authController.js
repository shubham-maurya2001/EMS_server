import User from '../models/User.js';
import Employee from '../models/Employee.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User Not Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Wrong Password" });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "10d" });
        return res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Network Connection Lost.' });
    }
}

const verify = (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
}

const resetPassword = async (req, res) => {
    try {
        const { email, dob, password, confirmPassword } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ success: false, error: "User Not Found." })
        }
        const employee = await Employee.findOne({ userId: user._id })
        const isMatch = new Date(employee.dob).toLocaleDateString() === new Date(dob).toLocaleDateString()
        if (!isMatch) {
            return res.status(500).json({ success: false, error: "Date of Birth not Matched." })
        }
        if (password !== confirmPassword) {
            return res.status(500).json({ success: false, error: "Password Not Matched." })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.findByIdAndUpdate({ _id: user._id }, { password: hashPassword })

        return res.status(200).json({ success: true, message: "Password has been reset successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error resetting password. Please try again.' })
    }

}
export { login, verify, resetPassword }