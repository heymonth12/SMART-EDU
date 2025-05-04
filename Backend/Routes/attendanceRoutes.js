import express from "express";
import Attendance from "../models/attendance.js";
import { roleMiddleware} from '../utils/authMiddleware.js'

const router = express.Router();

// CREATE Attendance
router.post("/create",roleMiddleware('faculty'), async (req, res) => {
    try {
        // console.log("hey i am at api /create")
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ Attendance Records
router.get("/get", async (req, res) => {
    try {       
        // console.log("hey i am at api /get")

        const attendanceRecords = await Attendance.findAll();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// find Attendance Records
router.post("/find", async (req, res) => {
    try {       
        // console.log("hey i am at api /get")
        const {where}=req.body
        const attendanceRecords = await Attendance.findAll({where});
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE Attendance
router.put("/u",roleMiddleware('faculty'), async (req, res) => {
    try {
        // console.log("hey i am at api /u")

        // console.log(req.body);

        // Separate `values` and `where` from request body
        const { values, where } = req.body;

        // Update operation
        const [rowsUpdated] = await Attendance.update(values, { where });

        // Check if any rows were updated
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "Update successful", rowsUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Attendance
router.delete("/d",roleMiddleware('faculty'), async (req, res) => {
    try {
        const where = req.body;
        const del = await Attendance.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ message: "No records found, check the entered query again" });
        }

        res.status(200).json({ message: "Deletion successful", del });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
