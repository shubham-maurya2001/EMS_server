import express from 'express';
import cors from 'cors'
import connectToDatabase from './db/db.js';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'

const PORT = process.env.PORT;
connectToDatabase();
const app = express();
app.use(cors(
    {
        origin: "https://ems-frontend-sigma.vercel.app",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
))
app.use(express.json())
app.use(express.static('public/uploads'))
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/dashboard', dashboardRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})