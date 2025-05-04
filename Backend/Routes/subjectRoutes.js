import express from "express";
import Subject from "../models/subject.js";

const router = express.Router();

// CREATE Subject
router.post("/create", async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ Subjects
router.get("/get", async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE Subject
router.post("/u", async (req, res) => {
    try {
        const { values, where } = req.body;

        const [rowsUpdated] = await Subject.update(values, { where });

        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "Update successful", rowsUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Subject
router.delete("/d", async (req, res) => {
    try {
        const where = req.body;

        const del = await Subject.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ message: "No records found, check the entered query again" });
        }

        res.status(200).json({ message: "Deletion successful", del });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
