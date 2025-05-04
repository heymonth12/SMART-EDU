import express from 'express';
import {authMiddleware , roleMiddleware} from './utils/authMiddleware.js'
import adminRoutes from './Routes/adminRoutes.js';
import assignmentRoutes from './Routes/assignmentRoutes.js';
import attendanceRoutes from './Routes/attendanceRoutes.js';
import campusRoutes from './Routes/campusRoutes.js';
import courseRoutes from './Routes/courseRoutes.js';
import facultyRoutes from './Routes/facultyRoutes.js';
import marksRoutes from './Routes/marksRoutes.js';
import studentRoutes from './Routes/studentRoutes.js';
import subjectRoutes from './Routes/subjectRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import details from './Routes/details.js';
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();  
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));

app.use(cookieParser());

// Register routes
app.use('/admin', authMiddleware, roleMiddleware('admin'), adminRoutes);
app.use('/assignment', authMiddleware, assignmentRoutes); // Role-based access on route level 
app.use('/attendance', authMiddleware, attendanceRoutes); // Role-based access on route level 
app.use('/campus', authMiddleware, roleMiddleware(['admin','faculty']), campusRoutes);
app.use('/course', authMiddleware, roleMiddleware(['admin','faculty']), courseRoutes);
app.use('/faculty', authMiddleware, roleMiddleware(['admin','faculty']), facultyRoutes);
app.use('/marks', authMiddleware, marksRoutes); // Role-specific middleware on route level 
app.use('/student', authMiddleware, roleMiddleware(['admin','faculty']), studentRoutes);
app.use('/subject', authMiddleware, roleMiddleware('admin'), subjectRoutes);
app.use('/details', authMiddleware, details);
app.use('/user', userRoutes); // No authMiddleware for login/register

  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
