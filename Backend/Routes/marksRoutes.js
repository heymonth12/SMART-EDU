import express from "express";
import Marks from "../models/marks.js";
import { roleMiddleware} from '../utils/authMiddleware.js'

const router = express.Router();

// CREATE Marks
router.post("/create",roleMiddleware('faculty'), async (req, res) => {
    try {
        const marks = await Marks.create(req.body);
        res.status(201).json(marks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ Marks Records for specific student
router.get("/get", async (req, res) => {
    try {
        const marksRecords = await Marks.findAll();
        res.status(200).json(marksRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// READ Marks Records for specific student
router.post("/g", async (req, res) => {
    try {
        const {where} = req.body;
        const marksRecords = await Marks.findAndCountAll({where});
        res.status(200).json(marksRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE Marks
router.post("/u",roleMiddleware('faculty'), async (req, res) => {
    try {
        console.log(req.body);

        // Separate `values` and `where` from request body
        const { values, where } = req.body;

        // Update operation
        const [rowsUpdated] = await Marks.update(values, { where });

        // Check if any rows were updated
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "Update successful", rowsUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Marks
router.delete("/d",roleMiddleware('faculty'), async (req, res) => {
    try {
        const where = req.body;
        const del = await Marks.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ message: "No records found, check the entered query again" });
        }

        res.status(200).json({ message: "Deletion successful", del });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
