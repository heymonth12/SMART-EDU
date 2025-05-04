import express from "express";
import Student from "../models/student.js";

const router = express.Router();

// CREATE Student
router.post("/create", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ Students
router.post("/get", async (req, res) => {
    try {
        const { where } = req.body;

        // Ensure 'where' is an object or default to an empty object
        if (where && typeof where !== 'object') {
            return res.status(400).json({ error: "Invalid 'where' condition format" });
        }
        if(!where){
            return res.status(404).json({ error: "where not found" });
        }
        const students = await Student.findAll({ where });
        
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/all", async (req, res) => {
    try {
        

        const students = await Student.findAll();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// UPDATE Student
router.post("/u", async (req, res) => {
    try {
        

        // Separate `values` and `where` from request body
        const { values, where } = req.body;

        // Update operation
        const [rowsUpdated] = await Student.update(values, { where });

        // Check if any rows were updated
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "Update successful", rowsUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Student
router.delete("/d", async (req, res) => {
    try {
        const where = req.body;
        const del = await Student.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ message: "No records found, check the entered query again" });
        }

        res.status(200).json({ message: "Deletion successful", del });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
